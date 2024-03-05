<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;

class IndexController extends Controller {

    public function index(){
        return view('agent.index');
    }
}
