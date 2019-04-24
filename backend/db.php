<?php
require_once "./idiorm.php";

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-TOKEN');

if (isset($_REQUEST['access_token']) && !empty($_REQUEST['access_token'])) {
  session_id($_REQUEST['access_token']);
}

session_start();

ORM::configure('mysql:host=mysql:3306;dbname=enote');
ORM::configure('username', 'root');
ORM::configure('password', 'secret');

// ORM::get_db()->exec("DROP TABLE IF EXISTS users;");
// ORM::get_db()->exec(
//   'CREATE TABLE users (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username VARCHAR(50) NOT NULL,' .
//       'password VARCHAR(50),' .
//       'email VARCHAR(50),' .
//       'UNIQUE KEY id (id),' .
//       'UNIQUE KEY username (username),' .
//       'UNIQUE KEY email (email))'
// );
// create_user("admin", "pass", "mail@dot.com");
// create_user("admin3", "pass", "mail3@dot.com");
// create_user("admin2", "pass", "mail2@dot.com");

// ORM::get_db()->exec("DROP TABLE IF EXISTS events;");
// ORM::get_db()->exec(
//   'CREATE TABLE events (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username_fk VARCHAR(50) NOT NULL,' .
//       'event VARCHAR(200),' .
//       'place VARCHAR(200),' .
//       'eYear INT,' .
//       'eMonth VARCHAR(3),' .
//       'eDate INT,' .
//       'eHour INT,' .
//       'eMinute INT,' .
//       'FOREIGN KEY (username_fk) REFERENCES users(username),' .
//       'UNIQUE KEY id (id))'
// );

// create_event("admin", "Don't forget to go to school", "place1", 2019, "APR", 19, "17", "00");
// create_event("adaadad", "Don't forget to go to school", "place2",2019, "APR", 19, "17", "00");
// create_event("admin", "Don't forget to sent part2 for PW", "place3",2019, "APR", 21, "23", "59");

function create_user($username, $password, $email) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (username_exists($username)) {
    $response['status'] = 'error';
    $response['message'] .= 'This username already exists. ';
  }

  if (email_exists($email)) {
    $response['status'] = 'error';
    $response['message'] .= 'This email already exists. ';
  }

  if ($response['status'] == 'success') {
    $u = ORM::for_table('users')->create();
    $u->username = $username;
    $u->password = $password;
    $u->email = $email;
    $u->save();
    $response['message'] = 'User has been added.';
  }

  return $response;
}

function create_event($username, $event, $ePlace, $eYear, $eMonth, $eDate, $eHour, $eMinute) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $e = ORM::for_table('events')->create();
  $e->username_fk = $username;
  $e->event = $event;
  $e->place = $ePlace;
  $e->eYear = $eYear;
  $e->eMonth = $eMonth;
  $e->eDate = $eDate;
  $e->eHour = $eHour;
  $e->eMinute = $eMinute;
  $e->save();
  $response['message'] = 'Event has been saved to DB.';

  return $response;
}

function username_exists($username) {
  $u = ORM::for_table('users')->where('username', $username)->find_one();
  if ($u != null) {
    return true;
  } else {
    return false;
  }
}

function email_exists($email) {
  $u = ORM::for_table('users')->where('email', $email)->find_one();
  if ($u != null) {
    return true;
  } else {
    return false;
  }
}

function login_user($username, $password) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $u = ORM::for_table('users')->where(array(
    'username' => $username,
    'password' => $password
  ))
  ->find_one();

  if ($u != null) {
    $response['message'] = $username;
    $response['access_token'] = session_id();
  } else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid username or password.';
  }

  return $response;
}

if (isset($_POST['submit-login'])) {
  sleep(2);
  $u = $_POST['username'];
  $p = $_POST['password'];
  $response = login_user($u, $p);
  if ($response['status'] == 'success') {
    $_SESSION['username'] = $u;
  }
  echo json_encode($response);
}

if (isset($_POST['submit-signup'])) {
  sleep(2);
  $u = $_POST['username'];
  $e = $_POST['email'];
  $p = $_POST['password'];
  echo json_encode(create_user($u, $p, $e));
}

if (isset($_POST['check-session'])) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (isset($_SESSION['username'])) {
    $response['message'] = $_SESSION['username'];
  } else {
    $response['status'] = 'error';
    $response['message'] = 'No username in current session.';
  }

  echo json_encode($response);
}

if (isset($_POST['logout-pressed'])) {
  $response = array(
    'status' => 'success',
    'message' => 'Logged out.'
  );

  session_unset();
  session_destroy();

  echo json_encode($response);
}

if (isset($_POST['save-new-event'])) {
  sleep(2);
  $response = array(
    'status' => 'success',
    'message' => ''
  );


  if (isset($_SESSION['username'])) {
    create_event(
      $_SESSION['username'],
      $_POST['new-event-description'],
      $_POST['new-event-place'],
      $_POST['new-event-year'],
      $_POST['new-event-month'],
      $_POST['new-event-date'],
      $_POST['new-event-hour'],
      $_POST['new-event-minute']
    );
    $response['message'] = 'Event was added';
    $response['event-hour'] = $_POST['new-event-hour'];
    $response['event-minute'] = $_POST['new-event-minute'];
    $response['event-description'] = $_POST['new-event-description'];
    $response['event-place'] = $_POST['new-event-place'];
  } else {
    $response['status'] = 'error';
    $response['message'] = 'You are not logged in';
  }

  echo json_encode($response);
}

if (isset($_POST['request-db'])) {
  sleep(2);
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (isset($_SESSION['username'])) {
    $db = ORM::for_table('events')
      ->where('username_fk', $_SESSION['username'])
      ->where('eYear', $_POST['selected-year'])
      ->where('eMonth', $_POST['selected-month'])
      ->order_by_asc('eDate')
      ->order_by_asc('eHour')
      ->order_by_asc('eMinute')
      ->find_array();
    $response['message'] = 'Database';
    $response['db'] = $db;
  } else {
    $response['status'] = 'error';
    $response['message'] = 'You are not logged in';
  }

  echo json_encode($response);
}

?>
