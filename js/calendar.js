var start;
var end;
$(function(){
    var currentDate; // Holds the day clicked when adding a new event
    var currentEvent; // Holds the event object when editing an event
	// Timepickers
    $('#start').datetimepicker({
        format: "HH:mm DD/MM/YYYY"
    });  
	$('#end').datetimepicker({
        useCurrent: false,
        format: "HH:mm DD/MM/YYYY"
    }); 
    $("#start").on("dp.change", function (e) {
        $('#end').data("DateTimePicker").minDate(e.date);
    });
    $("#end").on("dp.change", function (e) {
        $('#start').data("DateTimePicker").maxDate(e.date);
    });
    // Fullcalendar
    $('#calendar').fullCalendar({
        timeFormat: 'HH:mm',
		firstDay: '1',
		fixedWeekCount: false,
		eventLimit: 4,
        defaultTimedEventDuration: '00:30:00',
        editable: true,
		forceEventDuration: true,
        header: {
            left: 'prev, next, today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay'
        },
		views: {
			agendaWeek: {
				columnFormat: 'ddd D/M',
				minTime: "08:00:00",
				allDaySlot: true,
				slotEventOverlap: false
			},
			agendaDay: {
				minTime: "08:00:00",
				allDaySlot: true,
				slotEventOverlap: false
			}
		},
        // Get all events stored in database
        events:  'calendar/getEvents.php',
        // Handle Day Click
        dayClick: function(date, jsEvent, view) {
            if (moment(date).format('DD/MM/YYYY') == moment(new Date()).format('DD/MM/YYYY')) {
                currentDate = moment();
            } else {
				if (view.name == "month") {
					currentDate = date.add(8, 'h');
				}
                else {
					currentDate = date;
				}
            }
            // Open modal to add event
            modal({
                // Available buttons when adding
                buttons: {
                    add: {
                        id: 'add-event', // Buttons id
                        css: 'btn-success', // Buttons class
                        label: 'Add' // Buttons label
                    }
                },
                title: 'Add Event (' + date.format("dddd Do MMMM YYYY") + ')' // Modal title
            });
        },
        // Event Mouseover
        eventMouseover: function(event, jsEvent, view){
            var tooltip = '<div class="event-tooltip">Title:' + event.title + '<br>Description:' + event.description + '</div>';
            $("body").append(tooltip);
            $(this).mouseover(function(e) {
                $(this).css('z-index', 10000);
                $('.event-tooltip').fadeIn('500');
                $('.event-tooltip').fadeTo('10', 1.9);
            }).mousemove(function(e) {
                $('.event-tooltip').css('top', e.pageY + 10);
                $('.event-tooltip').css('left', e.pageX + 20);
            });
        },
        eventMouseout: function(event, jsEvent) {
            $(this).css('z-index', 8);
            $('.event-tooltip').remove();
        },
        // Handle Existing Event Click
        eventClick: function(event, jsEvent, view) {
			// Set currentEvent variable according to the event clicked in the calendar
			currentEvent = event;
			// Open modal to edit or delete event
			modal({
				// Available buttons when editing
				buttons: {
					delivered: {
						id: 'delivered-event',
						css: 'btn-info',
						label: 'Delivered'
					},
					delete: {
						id: 'delete-event',
						css: 'btn-danger',
						label: 'Delete'
					},
					update: {
						id: 'update-event',
						css: 'btn-success',
						label: 'Update'
					}
				},
				title: 'Edit Event "' + event.title + '"',
				event: event
			});
			
        },
        eventDrop: function(event, delta, revertFunc, jsEvent, ui, view)
        {
			if (event.allDay) {
				allday = true;
			} else {
				allday = null;
			}
            $.post('calendar/updateEvent.php', {
                id: event._id,
                title: event.title,
                description: event.description,
				email: event.email,
                color: event.color,
                start: event._start.format(),
                end: event._end.format(),
				allDay: allday
            }, function(result){
                resetDates();
				$('#calendar').fullCalendar("refetchEvents");
            });
        },
        eventResize: function(event, delta, revertFunc, jsEvent, ui, view) 
        {
			if (event.allDay) {
				allday = true;
			} else {
				allday = null;
			}
            $.post('calendar/updateEvent.php', {
                id: event._id,
                title: event.title,
                description: event.description,
				email: event.email,
                color: event.color,
                start: event._start.format(),
                end: event._end.format(),
				allDay: allday
            }, function(result){
                resetDates();
				$('#calendar').fullCalendar("refetchEvents");
            });
        }
    });
    // Prepares the modal window according to data passed
    function modal(data) {
		//if (loggedin) {
		// Set modal title
		$('.modal-title').html(data.title);
		// Clear buttons except Cancel
		$('.modal-footer button:not(".btn-default")').remove();
		// Set input values
		$('#title').val(data.event ? data.event.title : '');
		if( ! data.event) {
			// When adding set timepicker to current time
			start = currentDate;
			//end = moment(null);
			end = null;
		} else {
			// When editing set timepicker to event's time
            start = data.event.start;
            end = data.event.end;
		}
		$('#start').data("DateTimePicker").date(start);
		$('#end').data("DateTimePicker").date(end);
		$('#description').val(data.event ? data.event.description : '');
		if (data.event) {
			if (data.event.color == '#005EFF') {
				$('#type-0').prop('checked',true);
				$("#emailform-group").show();
			} 
			if (data.event.color == '#A200FF') {
				$('#type-1').prop('checked',true);
				$("#emailform-group").hide();
			}
			if (data.event.allDay == "true") {
				$('#allday-0').prop('checked', true);
				$('#endgroup').hide();
				$('#start').data("DateTimePicker").disable();
			}
		} else {
			$('#type-0').prop('checked',true);
			$("#emailform-group").show();
		}
		//set the email field
		$("#email").val(data.event ? data.event.email : email);
		// Create Butttons
		$.each(data.buttons, function(index, button){
			$('.modal-footer').prepend('<button type="button" id="' + button.id  + '" class="btn ' + button.css + '">' + button.label + '</button>')
		}) 
		if (data.event) {
			if (data.event.color != '#005EFF') {
				$('#delivered-event').remove();
			}
		}
		//Show Modal
		$('#calendarModal').modal('show');
		/*} else {
			alert('You must sign in to edit the calendar.')
		}*/
    }
    // Handle Click on Add Button
    $('.modal').on('click', '#add-event',  function(e){
        if(validator(['title', 'description'])) {
            $.post('calendar/addEvent.php', {
                title: $('#title').val(),
                description: $('#description').val(),
				email: $('#email').val(),
				color: $('input[name="type"]:checked').val(),
                start: $('#start').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				end: $('#end').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				allDay: ($('#allday-0').prop('checked') ? true : null)
            }, function(result){
                $('.modal').modal('hide');
                resetDates();
                $('#calendar').fullCalendar("refetchEvents");
            });
        }
    });
    // Handle click on Update Button
    $('.modal').on('click', '#update-event',  function(e){
		if(validator(['title', 'description'])) {
			$.post('calendar/updateEvent.php', {
				id: currentEvent._id,
				title: $('#title').val(),
				description: $('#description').val(),
				email: $('#email').val(),
				color: $('input[name="type"]:checked').val(),
				start: $('#start').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				end: $('#end').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				allDay: (($('#allday-0').prop('checked')) ? true : null)
			}, function(result){
				$('.modal').modal('hide');
				resetDates();
				$('#calendar').fullCalendar("refetchEvents");
			});
		}
    });
	// Handle click on Delivered Button
    $('.modal').on('click', '#delivered-event',  function(e){
		if(validator(['title', 'description'])) {
			$.post('calendar/deliveredEvent.php', {
				id: currentEvent._id,
				title: $('#title').val(),
				description: $('#description').val(),
				email: $('#email').val(),
				color: "#00FF44",
				start: $('#start').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				end: $('#end').data("DateTimePicker").date().format('YYYY-MM-DD HH:mm:ss'),
				allDay: (($('#allday-0').prop('checked')) ? true : null)
			}, function(result){
				$('.modal').modal('hide');
				resetDates();
				$('#calendar').fullCalendar("refetchEvents");
			});
		}
    });
    // Handle Click on Delete Button
    $('.modal').on('click', '#delete-event',  function(e){
        $.get('calendar/deleteEvent.php?id=' + currentEvent._id, function(result){
            $('.modal').modal('hide');
            resetDates();
            $('#calendar').fullCalendar("refetchEvents");
        });
    });
    // Dead Basic Validation For Inputs
    function validator(elements) {
        var errors = 0;
        $.each(elements, function(index, element){
            if($.trim($('#' + element).val()) == '') errors++;
        });
        if(errors) {
            $('.error').html('Please insert a title and a description');
            return false;
        }
		if($('#start').data("DateTimePicker").date() == null ) {
			 $('.error').html('Please insert start date/time');
			 return false;
		}
		if(($('#end').data("DateTimePicker").date() == null ) && ($('#allday-0').prop('checked', false)) ) {
			 $('.error').html('Please insert end date/time');
			 return false;
		}
        return true;
    }
	$("[name=type]").click(function() {
		if ($("input[name=type]:checked").val() == "#A200FF") {
			$("#emailform-group").hide();
		}	
		if ($("input[name=type]:checked").val() == "#005EFF") {
			$("#emailform-group").show();
		}
	});
	$("[name=allday]").click(function() {
		if ($('#allday-0').prop('checked')) {
			$('#start').data("DateTimePicker").disable();
			$('#end').data("DateTimePicker").date($('#start').data("DateTimePicker").date())
			$('#endgroup').hide();
		}	
		if (!$('#allday-0').prop('checked')) {
			$('#start').data("DateTimePicker").enable();
			$('#endgroup').show();
		}
	});
	$("#emailform-group").val(email);
});
function resetDates() {
	$('.error').html('');
	$("#emailform-group").show();
	$('#endgroup').show();
	$('#allday-0').prop('checked', false);
	$('#start').data("DateTimePicker").enable();
}