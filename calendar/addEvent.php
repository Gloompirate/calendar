<?php
	// Require DB Connection
	require_once('dbconnection.php');
    // Add Event
	$query = $conn->prepare('INSERT INTO calendar (title, start, end, description, color, allDay, email, username) VALUES (?,?,?,?,?,?,?,?)');
	$query->execute(array($_POST['title'], $_POST['start'], $_POST['end'], $_POST['description'], $_POST['color'], $_POST['allDay'], $_POST['email'], $_POST['username']));
	
