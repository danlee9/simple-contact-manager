<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Contact;
use App\Klaviyo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();
        $contacts = Contact::where('user_id', $userId)->orderBy('first_name', 'asc')->get();
        $results = [];
        foreach ($contacts as $contact) {
            $results[] = $contact;
        }
        $page = $request->query('page');
        $perPage = 30;
        if (is_null($page)) {
            $offset = 0;
        } else {
            $offset = ($page - 1) * $perPage;
        }
        $portion = array_slice($results, $offset, $perPage);
        $paginate = new LengthAwarePaginator($portion, count($results), $perPage, $page);
        return json_encode($paginate);
    }

    public function store(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->passes()) {
            $userId = auth()->id();
            $contact = Contact::create([
                'user_id' => $userId,
                'first_name' => request('first_name'),
                'last_name' => request('last_name'),
                'email' => request('email'),
                'phone' => request('phone')
            ]);
            $klaviyo = new Klaviyo(config('services.klaviyo.api_key'));
            $klaviyoData = [
                '$first_name' => $contact->first_name,
                '$last_name' => $contact->last_name,
                '$email' => $contact->email,
                '$phone_number' => $contact->phone
            ];
            $klaviyoStatus = $klaviyo->identify($klaviyoData);
            // return response()->json(['success'=>true]);
            $contact->KlaviyoStatus = $klaviyoStatus;
            return json_encode($contact);
        }

    	return response()->json(['error'=>$validator->errors()->all()]);
    }

    public function show($id) {
        $contact = Contact::where('id', $id)->first();
        return json_encode($contact);
    }

    public function update(Request $request, $id)
    {
        $validator = $this->validator($request->all());

        if ($validator->passes()) {
            $contact = Contact::where('id', $id)->first();
            $contact->first_name = request('first_name');
            $contact->last_name = request('last_name');
            $contact->email = request('email');
            $contact->phone = request('phone');
            $contact->save();
            $klaviyo = new Klaviyo(config('services.klaviyo.api_key'));
            $klaviyoData = [
                '$first_name' => $contact->first_name,
                '$last_name' => $contact->last_name,
                '$email' => $contact->email,
                '$phone_number' => $contact->phone
            ];
            $klaviyoStatus = $klaviyo->identify($klaviyoData);
            $contact->KlaviyoStatus = $klaviyoStatus;
            return json_encode($contact);
        }

        return response()->json(['error'=>$validator->errors()->all()]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'min:8']
        ]);
    }
}
