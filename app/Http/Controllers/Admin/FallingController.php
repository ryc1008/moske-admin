<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Falling;
use Illuminate\Http\Request;

class FallingController extends Controller
{

    //配置项
    public function config(){
        try {
            $config =  [
                'is_boss' => Falling::IS_BOSS_TEXT,
                'venue' => Falling::VENUE_TEXT,
            ];
            return $this->returnJson(0, $config);
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }

    //列表
    public function list(Request $request)
    {
        try {
            $param = $request->all();
            $lists = Falling::list($param);
            state_to_text($lists, [
                'is_boss' => Falling::IS_BOSS_TEXT,
                'venue' => Falling::VENUE_TEXT,
            ]);
            return $this->returnJson(0, $lists);
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }

}
