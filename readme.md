# Ascentis Client Library

A node library for consuming Ascentis Web APIs.

[![Build Status](https://travis-ci.org/PlayNetwork/node-ascentis.png?branch=develop)](https://travis-ci.org/PlayNetwork/node-ascentis) [![Coverage Status](https://coveralls.io/repos/PlayNetwork/node-ascentis/badge.png?branch=develop)](https://coveralls.io/r/PlayNetwork/node-ascentis?branch=develop)

## Features



## Install

```Bash
npm install ascentis
```

## Usage

Ascentis Web API documentation: <http://www.ascentis.com/api/Documentation.asp>

```Javascript
var ascentis = require('ascentis');

// initialize an API client
var client = ascentis.initialize({
  account : 'company',
  clientKey : 'clientKey',
  host : 'selfservice2.ascentis.com',
  secretKey : 'secretKey'
});

// make API calls
ascentis.getEmployees(function (err, data) {
  if (!err) {
    // we haz teh datas
  }
});
```

### Authentication

<http://www.ascentis.com/api/authentication.asp>

Authentication is handled automatically for each API call provided that you supply the appropriate client key and secret key values.

### Find Employees

<http://www.ascentis.com/api/finder.asp>

```Javascript
ascentis.getEmployees(function (err, data) {
  if (!err) {
    // we haz teh datas
  }
});
```

If you would like to search for a specific employee, simply provide the search criteria when calling the method:

```Javascript
var criteria = {
  firstname : 'Broseph',
  lastname : 'McGee'
};

ascentis.getEmployees(criteria, function (err, data) {
  if (!err) {
    // we haz teh datas
  }
});
```

### Attach Files to Employee

<http://www.ascentis.com/api/attachments.asp>

### Retrieve Benefit Plan Enrollment Information

<http://www.ascentis.com/api/benefitsenrollment.asp>

### Find Benefit Plan ID

<http://www.ascentis.com/api/FindPlan.asp>

### Access User Defined Employee Fields

<http://www.ascentis.com/api/custom.asp>

```Javascript
ascentis.getFields(function (err, data) {
  if (!err) {
    // we haz teh datas
  }
});
```

### Work With Compensation Data

<http://www.ascentis.com/api/compensation.asp>

### Work With Existing Employee

<http://www.ascentis.com/api/employee.asp>

### Retrieve Employee Benefits

<http://www.ascentis.com/api/employeebenefits.asp>

### Retrieve Job Information for Employee

<http://www.ascentis.com/api/job.asp>

### Create New Hire

<http://www.ascentis.com/api/newhire.asp>

### Retrieve Direct Deposit Information for Employee

<http://www.ascentis.com/api/directdep.asp>

### Retrieve HR Change Log

<http://www.ascentis.com/api/changelog.asp>

### Find COBRA Eligible Employees

<http://www.ascentis.com/api/cobra.asp>

```Javascript
var criteria = {
  from : '01/01/2013'
};

ascentis.getCOBRAEligibleEmployees(criteria, function (err, data) {
  if (!err) {
    // we haz teh datas
  }
});
```

### Find Emergency Contacts for Employee

<http://www.ascentis.com/api/econtact.asp>

```Javascript
var employeeId = 101;

ascentis.getEmergencyContacts(employeeId, function (err, data) {
  if (!err) {
    // emergency contacts!
  }
});
```

### Retrieve All Jobs in Company

<http://www.ascentis.com/api/jobs.asp>

```Javascript
ascentis.getJobs(function (err, data) {
  if (!err) {
    // we haz teh jobs
  }
});
```

If you would like to retrieve a specific job, provide a job ID:

```Javascript
var jobId = 101;

ascentis.getJobs(jobId, function (err, data) {
  if (!err) {
    // we haz teh specific job
  }
});
```

### Retrieve All Locations in Company

<http://www.ascentis.com/api/location.asp>

```Javascript
ascentis.getLocations(function (err, data) {
  if (!err) {
    // we haz teh locations
  }
});
```

If you would like to retrieve a specific location, provide a location ID:

```Javascript
var locationId = 101;

ascentis.getLocations(locationId, function (err, data) {
  if (!err) {
    // we haz teh specific location
  }
});
```

### Bulk Data Retrieval

<http://www.ascentis.com/api/rawdata.asp>

```Javascript
ascentis.getRawData(function (err, data) {
  if (!err) {
    // we haz teh raw datas
  }
});
```

## License

MIT, see LICENSE
