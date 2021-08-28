const siteKey = '';

function fetchIssues() {
  var issues = JSON.parse(localStorage.getItem('issues')) || [];
  var issuesList = document.getElementById('issuesList');

  issuesList.innerHTML = '';

  for (var i = 0; i < issues.length; i++) {
    var id = issues[i].id;
    var desc = issues[i].description;
    var severity = issues[i].severity;
    var assignedTo = issues[i].assignedTo;
    var status = issues[i].status;

    issuesList.innerHTML += '<div class="well">' +
      '<h6>Issue ID: ' + id + '</h6>' +
      '<p><span class="label label-info">' + status + '</span></p>' +
      '<h3>' + desc + '</h3>' +
      '<p><span class="glyphicon glyphicon-time"></span> ' + severity + ' ' +
      '<span class="glyphicon glyphicon-user"></span> ' + assignedTo + '</p>' +
      '<a href="#" class="btn btn-warning" onclick="setStatusClosed(\'' + id + '\')">Close</a> ' +
      '<a href="#" class="btn btn-danger" onclick="deleteIssue(\'' + id + '\')">Delete</a>' +
      '</div>';
  }
}

function saveIssue() {
  var issueId = chance.guid();
  var issueDesc = document.getElementById('issueDescInput').value;
  var issueSeverity = document.getElementById('issueSeverityInput').value;
  var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
  var issueStatus = 'Open'; var issue = {
    id: issueId,
    description: issueDesc,
    severity: issueSeverity,
    assignedTo: issueAssignedTo,
    status: issueStatus
  }

  var issues = localStorage.getItem('issues')
  issues = issues && JSON.parse(issues) || []
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();

  fetchIssues();
}


function setStatusClosed(id) {
  var issues = JSON.parse(localStorage.getItem('issues'));

  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues[i].status = 'Closed';
    }
  }

  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();
}

function deleteIssue(id) {
  var issues = JSON.parse(localStorage.getItem('issues'));

  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues.splice(i, 1);
    }
  }

  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();
}


document.getElementById('issueInputForm').addEventListener('submit', (e) => e.preventDefault());


function onloadCallback() {
  grecaptcha.render('recaptcha', {
    'sitekey': siteKey,
    'callback': verifyCallback,
    'expired-callback': expiredCallback,
    'theme': 'dark'
  });
};

function verifyCallback(response) {
  fetch('/siteverify', {
    method: 'POST',
    body: response
  }).then((res) => {
    if (res.ok) {
      res.json().then(body => {
        body = JSON.parse(body);
        if (body.success) {
          document.getElementById('issueInputForm')
            .addEventListener('submit', saveIssue);
          $('#submitButton').removeClass('disabled');
        } else {
          console.log("no success");
          expiredCallback();
        }
      })
    } else {
      console.log("not ok");
      expiredCallback();
    }
  }).catch((e) => {
    console.error(e);
    expiredCallback();
  });
}

function expiredCallback() {
  document.getElementById('issueInputForm').removeEventListener('submit', saveIssue);
  $('#submitButton').addClass('disabled');
}
