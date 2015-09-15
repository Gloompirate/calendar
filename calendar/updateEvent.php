<?php
	// Require DB Connection
	require_once('dbconnection.php');
    // Update Event
	$query = $conn->prepare('UPDATE calendar SET title = ?,start = ?,end = ?, description = ?, color = ?, allDay = ?, email = ?, username = ? WHERE id = ?');
	$query->execute(array($_POST['title'], $_POST['start'], $_POST['end'], $_POST['description'], $_POST['color'], $_POST['allDay'], $_POST['email'], $_POST['username'], $_POST['id']));
	
