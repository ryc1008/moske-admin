<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;

class IndexController extends Controller {

    public function index(){
        return view('system.index');
    }
}
