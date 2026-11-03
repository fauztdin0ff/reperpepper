<?php
$tg_token 	= '8196412347:AAEgR2EiF1TC1OXia7xJXWBCj3u0XqhUmu8';
$tg_bot		= 'reper_peper_bot';
$tg_developer_id 	= 359976309;
$tg_MASTER_id 		= -4964274771;

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

if( isset($_POST['form_data']) ){
	parse_str($_POST['form_data'], $_REQUEST);
}

$url 	= test_input( $_REQUEST['url'] );
$form 	= test_input( $_REQUEST['form'] );

$name 	= test_input( $_REQUEST['name'] );

$lucky 	= test_input( $_REQUEST['lucky'] );
$phone 	= test_input( $_REQUEST['phone'] );
$email 	= test_input( $_REQUEST['email'] );
$text 	= test_input( $_REQUEST['text'] );

// 1 проверка на СПАМ
if ( $name ) return false;

$name = $lucky;

// 2 проверка на СПАМ
if ( ! preg_match("/[а-я]/iu", $name, $matches, PREG_OFFSET_CAPTURE) ) return false;




if( $name and $phone and $url and $form ){

	$chat_id = $tg_MASTER_id;
	//$chat_id = $tg_developer_id;

$text = "Имя: $name
Телефон: $phone
E-mail: $email
Немного о проекте: $text
Страница: $url
Источник: $form
";

	$dataSend = Array(
		'text' 		=> $text,
		'chat_id' 	=> $chat_id,
	);

	$ch = curl_init("https://api.telegram.org/bot". $tg_token ."/sendMessage?" . http_build_query($dataSend));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, false);
	$resultQuery = curl_exec($ch);
	curl_close($ch);
	
	//var_dump( $resultQuery );
	$result = json_decode( $resultQuery );
	
	echo $result->result->message_id;
	
	//header('Location: /thanks.html'); 
}
?>