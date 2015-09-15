<?php
	$dbuser = 'root';
	$dbpass = 'root';
	$dbhost = 'localhost';
	$dbname = 'intranet';
	$dbtype = 'mysql';
	try {
		$conn = new PDO($dbtype . ':host=' . $dbhost . ';dbname=' . $dbname, $dbuser, $dbpass);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	} catch (PDOException $e) {
		AWESOME_error($e);
		die();
	}
?>