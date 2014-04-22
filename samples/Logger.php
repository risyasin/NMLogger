<?php

/**
 * Custom Logger for PHP
 * 
 * Sends all required to sample logger as in Non-blocking way.
 * Sample usage:
 * 
 * ```
 * $logger = new Logger();
 * $logger->error(array('err_no' => 404, 'errmsg' => 'Not Found', 'state' => $_SERVER));
 * ```
 * */


class Logger {

    private static $handle;

    public static $server = 'http://localhost:8081/log/';

    public static $calls = array();

    public static $options = array(
        'header'         => true,
        'returntransfer' => true,
        'timeout'        => 2,
        'tcp_nodelay'    => true
      );

    public static $max_calls = 100;

    public function __construct()
    {
        return $this;
    }

    public function log($data)
    {
        if (count(self::$calls) <= self::$max_calls) {
            self::$calls[]['info'] = self::handleMessage($data);
        }
    }

    public function error($data)
    {
        if (count(self::$calls) <= self::$max_calls) {
            self::$calls[]['error'] = self::handleMessage($data);
        }
    }

    public function stat($data)
    {
        if (count(self::$calls) <= self::$max_calls) {
            self::$calls[]['stat'] = self::handleMessage($data);
        }
    }


    public function myCustomLog($data)
    {
        if (count(self::$calls) <= self::$max_calls) {
            self::$calls[]['custom_collection'] = self::handleMessage($data);
        }
    }


    private function handleMessage($msg)
    {
        if (in_array(gettype($msg), array('string', 'boolean', 'integer'))) {
            return array('message' => $msg);
        } elseif (gettype($msg) == 'array') {
            if (!empty($msg[0])) {
                return array('message' => $msg);
            } else {
                return $msg;
            }
        } else {
            return (array) $msg;
        }
    }

    public function testConnection()
    {
        echo json_encode($this->_call(self::$server, 'get')); exit;
    }


    private static function getHandle()
    {
        if (self::$handle == null) {
            self::$handle = curl_init();
        }
        return self::$handle;
    }

    public function addOption($opt, $val)
    {
        self::$options[ltrim(strtolower($opt),'CURLOPT_')] = $val;
    }


    private function _call($url, $type = 'GET', Array $data = array())
    {
        $result = (object) array();

        if ($url == null) { trigger_error('cUrl requires a URL parameter!', E_USER_ERROR); }

        self::getHandle();

        self::addOption('url', $url);

        if (empty($data['ip'])) { $data['ip'] = $_SERVER['REMOTE_ADDR']; }

        if (empty($data['ua'])) { $data['ua'] = $_SERVER['HTTP_USER_AGENT']; }

        if (strtolower($type) == 'post') {
            self::addOption('post', true);
            self::addOption('httpheader', array("Content-type: application/json"));
            self::addOption('postfields', json_encode($data));
        }

        foreach(self::$options as $k => $v) {
            curl_setopt(self::$handle, constant('CURLOPT_'.strtoupper($k)), $v);
            /// echo 'CURLOPT_'.strtoupper($k).' - '.$v.' <br>';
        }


        $response = curl_exec(self::$handle);

        // header('Content-Type: application/json'); echo json_encode(array($response, curl_error(self::$handle), curl_getinfo(self::$handle)));  exit;

        $header_size = curl_getinfo(self::$handle, CURLINFO_HEADER_SIZE);

        $result->headers = substr($response, 0, $header_size);

        $result->response = (object) json_decode(substr($response, $header_size ));

        $result->http_code = curl_getinfo(self::$handle, CURLINFO_HTTP_CODE);

        return $result;

    }

    final public function __destruct()
    {
        if (count(self::$calls)>0) {
            foreach(self::$calls as $v) {
                $type = current(array_keys($v));
                $url = self::$server.$type;
                $res = $this->_call($url, 'post', $v[$type]);
                if ($res->http_code !== 200) {
                    trigger_error('Failed to send log: '.json_encode($res));
                }
            }
        }

        curl_close(self::$handle);
    }

}


