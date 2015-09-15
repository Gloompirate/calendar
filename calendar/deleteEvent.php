<?php
	// Require DB Connection
	require_once('dbconnection.php');
    // Delete Event
	$query = $conn->prepare('DELETE FROM calendar WHERE id = ?');
	$query->execute(array($_GET['id']));
	
