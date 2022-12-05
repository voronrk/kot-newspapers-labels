<?php

class Handler
{
    public static function save($data) {
        $dataJSON = json_encode($data);
        $result = file_put_contents('data.json', $dataJSON);
        return json_encode($result);
    }

    public static function load() {
        if (file_exists('data.json')) {
            $data = file_get_contents('data.json');
            return $data;
        } else {
            return json_encode([]);
        };
    }
}

$request=json_decode(file_get_contents('php://input'),true);

$method = $request['method'];
$data = $request['data'];

switch ($method) {
    case "save":
        $result = Handler::save($data);
        echo $result;
	break;
    case "load":
        $result = Handler::load();
        echo $result;
	break;
};
