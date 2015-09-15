<!DOCTYPE html>
<html>
    <head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Visitors and Deliveries</title>
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/fullcalendar.min.css" rel="stylesheet">
        <link href="css/fullcalendar.print.css" rel="stylesheet" media="print">
		<link href="css/bootstrap-datetimepicker.min.css" rel="stylesheet">
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/moment.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/fullcalendar.min.js"></script>
        <script src="js/bootstrap-datetimepicker.min.js"></script>
        <script src="js/calendar.js"></script>
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
    </head>
	<style>
        .fc th {
            padding: 10px 0px;
            vertical-align: middle;
            background:#F2F2F2;
        }
        .fc-day-grid-event>.fc-content {
            padding: 4px;
        }
        .error {
            color: #ac2925;
            margin-bottom: 15px;
        }
        .fc-event {
        min-height: 12px; // additional styling here
        }
        .event-tooltip {
            width:150px;
            background: rgba(0, 0, 0, 0.85);
            color:#FFF;
            padding:10px;
            position:absolute;
            z-index:10001;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
		}
    </style>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-10">
					<div class="panel panel-default">
						<h4 class="panel-heading text-center" style="margin-top:0px; margin-bottom:0px;">Visitors and Deliveries Calendar</h4>
						<div class="panel-body">
							<div id='calendar'></div>
						</div>
					</div>
                </div>
				<div class="col-md-2">
					<div class="panel panel-default">
						<h4 class="panel-heading text-center" style="margin-top:0px; margin-bottom:0px;">Key</h4>
						<div class="panel-body" style="padding:0px">
							<table class="table table-bordered" style="margin-bottom:0px">
								<tbody>
									<tr>
										<td bgcolor="#A200FF" style="width:25%"></td>
										<td>Visitor</td>
									</tr>
									<tr>
										<td bgcolor="#005EFF" style="width:25%"></td>
										<td>Delivery</td>
									</tr>
									<tr>
										<td bgcolor="#35BF3A" style="width:25%"></td>
										<td>Delivery Recieved</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>	
				</div>
            </div>
        </div>
        <div class="modal fade" id="calendarModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" onClick="resetDates();"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title"></h4>
                    </div>
                    <div class="modal-body">
                        <div class="error"></div>
                        <form class="form-horizontal" id="crud-form">
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">Title</label>
                                <div class="col-md-8">
                                    <input id="title" name="title" type="text" class="form-control input-md" required>
                                </div>
                            </div>
							<div class="form-group">
								<label class="col-md-3 control-label" for="allday">All Day Event</label>
								<div class="col-md-8">
									<div class="checkbox">
										<label for="allday-0">
										<input type="checkbox" name="allday" id="allday-0" value="1">
										Yes
										</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label" for="start">Start</label>
								<div class="col-md-8">
									<div class="input-group date" id="start" name="start">
										<input type="text" class="form-control">
										<span class="input-group-addon">
											<span class="glyphicon glyphicon-calendar"></span>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group" id="endgroup">
								<label class="col-md-3 control-label" for="end">End</label>
								<div class="col-md-8">
									<div class="input-group date" id="end" name="end">
										<input type="text" class="form-control">
										<span class="input-group-addon">
											<span class="glyphicon glyphicon-calendar"></span>
										</span>
									</div>
								</div>
							</div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="description">Description</label>
                                <div class="col-md-8">
                                    <textarea class="form-control" id="description" name="description" style="height:75px" required></textarea>
                                </div>
                            </div>
							<div class="form-group" id="emailform-group">
                                <label class="col-md-3 control-label" for="email">Email To Notify</label>
                                <div class="col-md-8">
                                    <input id="email" name="email" type="email" class="form-control input-md" required>
                                </div>
                            </div>
                            <div class="form-group">
								<label class="col-md-3 control-label" for="type">Type</label>
								<div class="col-md-8"> 
									<label class="radio-inline" for="type-0">
										<input type="radio" name="type" id="type-0" value="#005EFF">
										Delivery
									</label> 
									<label class="radio-inline" for="type-1">
										<input type="radio" name="type" id="type-1" value="#A200FF">
										Visitor
									</label> 
								</div>
							</div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" onClick="resetDates();">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>




