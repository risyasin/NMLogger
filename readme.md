### NMLogger
A generic log facility that uses NodeJS & MongoDB


##### Samples

- Custom Logger for PHP
Sends all required to sample logger as in Non-blocking way.
Sample usage:

	$logger = new Logger();
	$logger->error(array('err_no' => 404, 'errmsg' => 'Not Found', 'state' => $_SERVER));


- Custom Logger jQuery
Sends all data in parameter, additionally adds location.href & browser info via $.browser obj of jQuery

    $(".my_button").click(function () {
        $.Logger({ my_action_to_log: 'whatever' });
    });
