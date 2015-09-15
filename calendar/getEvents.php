<?php
	// Require DB Connection
	require_once('dbconnection.php');
    // Get ALl Event
	$query = $conn->prepare('SELECT * FROM calendar WHERE start BETWEEN ? AND ? ORDER BY start ASC');
	$query->execute(array($_GET['start'], $_GET['end']));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
