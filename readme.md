##### SCVlogger
A Basic Log facility uses NodeJS & MongoDB


Samples/Logger.php

Custom Logger for PHP
Sends all required to sample logger as in Non-blocking way.
Sample usage:

	$logger = new Logger();
	$logger->error(array('err_no' => 404, 'errmsg' => 'Not Found', 'state' => $_SERVER));

