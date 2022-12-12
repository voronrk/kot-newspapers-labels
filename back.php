<?php

class Handler
{
    public static function save($data, $name, $customer) {
        $dataJSON = json_encode(['customer' => $customer, 'date' => date("d.m.Y H:i:s"), 'data' => $data]);
        $result = file_put_contents($name, $dataJSON);
        return json_encode($result);
    }

    public static function load_old($name) {
        if (file_exists($name)) {
            $data = file_get_contents($name);
            return $data;
        } else {
            return json_encode([]);
        };
    }

    public static function load() {
        $data = [];
        $fileNames = scandir('data');
        unset($fileNames[0]);
        unset($fileNames[1]);
        foreach($fileNames as $name) {
            $data[] = json_decode(file_get_contents('data/' . $name));
        };
        return json_encode($data);
    }
}

$request=json_decode(file_get_contents('php://input'),true);

$method = $request['method'];
$data = $request['data'];
$name = 'data/' . $request['name'] . '.json';
$customer = isset($request['customer']) ? $request['customer'] : '';

switch ($method) {
    case "save":
        $result = Handler::save($data, $name, $customer);
        echo $result;
	break;
    case "load":
        $result = Handler::load($name);
        echo $result;
	break;
};
