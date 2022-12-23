<?php

class Handler
{

    private static function compileFileName($fileName)
    {
        return 'data/' . $fileName . '.json';
    }

    public static function save($params) 
    {
        $fileName = self::compileFileName($params['fileName']);
        $labelName = $params['labelName'];
        $data = $params['data'];
        $dataJSON = json_encode(['labelName' => $labelName, 'date' => date("d.m.Y H:i:s"), 'data' => $data]);
        $result = file_put_contents($fileName, $dataJSON);
        return json_encode($result);
    }

    public static function load($params) 
    {
        $fileName = self::compileFileName($params['fileName']);
        $data = file_exists($fileName) ? json_decode(file_get_contents($fileName)) : [];
        return json_encode($data);
    }
}

$request=json_decode(file_get_contents('php://input'),true);

$method = $request['method'];

switch ($method) {
    case "save":
        $result = Handler::save($request['params']);
        echo $result;
	break;
    case "load":
        $result = Handler::load($request['params']);
        echo $result;
	break;
};
