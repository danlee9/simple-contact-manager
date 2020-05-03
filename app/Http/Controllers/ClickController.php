<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Klaviyo;

class ClickController extends Controller
{
    public function track()
    {
        $klaviyo = new Klaviyo(config('services.klaviyo.api_key'));
        return $klaviyo->track(
            'Button Clicked',
            array('$email' => request('email'))
        );
    }
}
