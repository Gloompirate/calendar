<?php
	// Require DB Connection
	require_once('dbconnection.php');
    // Update Event
	$query = $conn->prepare('UPDATE calendar SET title = ?,start = ?,end = ?, description = ?, color = ?, allDay = ?, email = ? , username = ? WHERE id = ?');
	$query->execute(array($_POST['title'], $_POST['start'], $_POST['end'], $_POST['description'], $_POST['color'], $_POST['allDay'], $_POST['email'], $_POST['username'], $_POST['id']));
	
	//create the email message
	date_default_timezone_set('Europe/London');
	$date = date('H:i:s d/M/Y');
	$message = 'You delivery "' . $_POST['title'] . '" was marked as received by ' . $_POST['fohuser'] . ' at ' . $date;
	
	//set up the mailer
	require 'PHPMailerAutoload.php';
	$mail = new PHPMailer;
	$mail->isSMTP();
	$mail->Host = 'mail.everymanplayhouse.com';
	$mail->Port = 25;
	$mail->From = 'calendar@everymanplayhouse.com';
	$mail->FromName = 'Calendar';
	$mail->addAddress($_POST['email']);     
	$mail->isHTML(true); 
	$mail->Subject = 'Your delivery has arrived';
	$mail->Body    = $message;
	$mail->AltBody = $message;
	
	//send the email
	if(!$mail->send()) {
		echo 'Message could not be sent.';
		echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		echo 'Message has been sent';
	}
?>
	
