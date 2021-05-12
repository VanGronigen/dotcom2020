<?php
if(isset($_POST['submit'])){
 $name=$_POST['name'];
  $email=$_POST['email'];

  //send mail 
 $to='happytriggerapp@gmail.com';
 $subject='Android Subscriber';
 $body='<html>
 <body>
 <h3>Android?</h3>
 <hr>

 <p> Name : '.$name.'</p>
 <br>

 <p> Email : '.$email.'</p>

 </body>

 </html>';

 $headers  ="From:".$name."<".$email.">\r\n";
 $headers .="reply-To:".$email."\r\n";
 $headers .="NINE-Version: 1.0\r\n";
 $headers .="Content-type: text/html; charset=utf-8";


//confirmation mail
 $user=$email;
 $usersubject = "Android Beta Program: First Steps";
 $userheaders = "From: HappyTriggerApp@gmail.com\n";
 $usermessage = "Thank you for taking the first steps to enjoying the Happy Trigger on your mobile phone! We will be contacting you shortly with more information concerning the program, as well as periodically send you updates about developments with the Happy Trigger app. Stay tuned";


//sending process
 $send=mail($to, $subject, $body, $headers);
 $confirm=mail($user, $usersubject, $userheaders,$usermessage );

 if($send && $confirm){
  echo "success";
 }

 else{
  echo "Failed";
 }

}
?>

<!DOCTYPE html>
<html>
<head>
 <title>Contact Form</title>
</head>
<body>
<form action="" method="POST">

<input type="text" name="name" placeholder="Name">
<input type="email" name="email" placeholder="email">
<input type="submit" name="submit" value="send">
</form>

</body>
</html>