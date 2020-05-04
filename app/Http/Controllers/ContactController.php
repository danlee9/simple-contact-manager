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
                '$id' => $contact->id,
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
                '$id' => $contact->id,
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

    public function uploadFile(Request $request)
    {
        $file = $request->file('file');

        // File Details 
        $filename = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();

        // Valid File Extensions
        $valid_extension = array("csv");

        // 2MB in Bytes
        $maxFileSize = 2097152; 

        // Check file extension
        if(in_array(strtolower($extension), $valid_extension)){

            // Check file size
            if($fileSize <= $maxFileSize){

                // File upload location
                $location = 'uploads';

                // Upload file
                $file->move($location,$filename);

                // Import CSV to Database
                $filepath = public_path($location."/".$filename);

                // Reading file
                $file = fopen($filepath,"r");

                $importData_arr = array();
                $i = 0;

                while (($filedata = fgetcsv($file, 1000, ",")) !== FALSE) {
                    $num = count($filedata );
                    
                    // Skip first row (Remove below comment if you want to skip the first row)
                    if($i == 0){
                        $i++;
                        continue; 
                    }
                    for ($c=0; $c < $num; $c++) {
                        $importData_arr[$i][] = $filedata [$c];
                    }
                    $i++;
                }
                fclose($file);
                $userId = auth()->id();

                $klaviyoSyncSuccess = true;

                // Insert to MySQL database
                foreach($importData_arr as $importData){

                    $contact = Contact::create([
                        'user_id' => $userId,
                        'first_name' => $importData[0],
                        'last_name' => $importData[1],
                        'email' => $importData[2],
                        'phone' => $importData[3]
                    ]);

                    $klaviyo = new Klaviyo(config('services.klaviyo.api_key'));
                    $klaviyoData = [
                        '$id' => $contact->id,
                        '$first_name' => $contact->first_name,
                        '$last_name' => $contact->last_name,
                        '$email' => $contact->email,
                        '$phone_number' => $contact->phone
                    ];
                    $klaviyoResult = $klaviyo->identify($klaviyoData);
                    if ($klaviyoSyncSuccess)
                        $klaviyoSyncSuccess = $klaviyoResult;
                }

                $status = 'Import Successful.';
            } else {
                $status = 'File too large. File must be less than 2MB.';
            }

        } else {
            $status = 'Invalid File Extension.';
        }
        $res = ['status' => $status, 'klaviyoSyncStatus' => $klaviyoSyncSuccess];
        return json_encode($res);
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
