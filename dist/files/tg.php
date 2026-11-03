<?php
global $tg_token, $tg_bot, $tbl_content, $tbl_tvs, $group_id;
$tg_token 	= '8196412347:AAEgR2EiF1TC1OXia7xJXWBCj3u0XqhUmu8';
$tg_bot		= 'reper_peper_bot';
$group_id 	= -769749324;
//$group_id 	= -1002084143341;


// определяем кодировку
header('Content-type: text/html; charset=utf-8');
// Создаем объект бота
$bot = new Bot();
// Обрабатываем пришедшие данные
$bot->init('php://input');




/** 
 * Class Bot
 */
class Bot
{
    // <bot_token> - созданный токен для нашего бота от @BotFather
   // private $botToken = "5184668303:AAFjevck_V8JhMHT775mMRFI7izXowgBXyU";
    // адрес для запросов к API Telegram

    public function init($data)
    {
		global $modx, $tbl_content, $tbl_tvs, $tg_token, $tg_bot, $group_id;
        // создаем массив из пришедших данных от API Telegram
        $arrData = $this->getData($data);

		if( gettype($arrData) != 'array' ){
			// самая первая авторизация
			$url = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
			$dataSend = array(
						'url' => $url
			);
			$this->requestToTelegram($dataSend, "setWebhook");
			echo "<br/><br/>Настройка веб-хука на адрес $url<br/>
					tg_bot: <b>$tg_bot</b>, tg_token: <b>$tg_token</b>";
			
			return;
		}

        // лог
        // $this->setFileLog($arrData);

        if (array_key_exists('message', $arrData)) {
            $chat_id = $arrData['message']['chat']['id'];
            $message = $arrData['message']['text'];
			if( $arrData['message']['contact']['phone_number'] ) {
				$phone	 = $arrData['message']['contact']['phone_number'];
				$phone 	 = substr( preg_replace('/[^0-9]/', '', $phone), -10);
				$message = 'getContact';
			}
			
		} elseif (array_key_exists('poll_answer', $arrData)) {
			
			/*$ja = json_encode( $arrData['poll_answer'] );
			$ds = array('text' => $ja,'chat_id' => 359976309);
			echo $this->requestToTelegram($ds, "sendMessage");*/

			$tournament_poll_id = $arrData['poll_answer']['poll_id'];
							
			$ds = array(
					'text' => $text,
					//'chat_id' => 359976309
			);
			echo $this->requestToTelegram($ds, "sendMessage");
			
        } elseif (array_key_exists('callback_query', $arrData)) {
            $chat_id = $arrData['callback_query']['message']['chat']['id'];
			//$message = $arrData['callback_query']['data'];
			
			$answer  	= explode(' ', $arrData['callback_query']['data']);
            $message 	= $answer[0];
        }
		
		/*$ds = array(
				'text' => $message,
				'chat_id' => 359976309
		);
		echo $this->requestToTelegram($ds, "sendMessage");*/
		
/*		
		$dataSend = array(
                    //'text' => "Проверка chat_id $chat_id телефон $phone // $data",
					'text' => json_encode( $arrData ),
					
                    'chat_id' => $chat_id,
                    //'reply_markup' => $inlineKeyboard,
        );
		$this->requestToTelegram($dataSend, "sendMessage");
*/
		$justKeyboard = $this->getKeyBoard([[["text" => "Показать свой номер телефона","request_contact"=>true]]]);

        switch ($message) {
            case '/start':

					$dataSend = array(
						'text' => "Добро пожаловать",
						'chat_id' => $chat_id,
						'reply_markup' => json_encode(array('remove_keyboard'=>true))
					);
				
                $this->requestToTelegram($dataSend, "sendMessage");
            break;
			
            case 'getContact':
				$uid = $modx->db->getValue($modx->db->query("SELECT id FROM $tbl_content WHERE longtitle='$phone'"));
				if( !$uid ){
					$text = "Телефона +7$phone нет в базе данных. Свяжитесь с организатором.";
				} else {
					$modx->db->update(Array('introtext'=>$chat_id), $tbl_content, "id=$uid");
					$text = "Вижу-вижу! Знакомы. Давай начнем /start";
					
					$uName = $modx->db->getValue($modx->db->query("SELECT pagetitle FROM $tbl_content WHERE longtitle='$phone'"));
					$dataSend = array(
						'text' => "Подтвердил свой контакт: $uName",
						'chat_id' => 359976309,
					);
					$this->requestToTelegram($dataSend, "sendMessage");
				}
                $dataSend = array(
                    'text' => $text,
                    'chat_id' => $chat_id,
					'reply_markup' => json_encode(array('remove_keyboard'=>true))
                );
				$this->requestToTelegram($dataSend, "sendMessage");
                break;
			case '/reset':
				$modx->db->update(Array('introtext'=>''), $tbl_content, "introtext='$chat_id'");
				$dataSend = array(
						'text' => "Ну и зря! А может начнем всё с начала? /start",
						'chat_id' => $chat_id,
						'reply_markup' => json_encode(array('remove_keyboard'=>true))
				);
				$this->requestToTelegram($dataSend, "sendMessage");
				
				$dataSend = array(
						'text' => "Ушел юзер с chat_id: $chat_id",
						'chat_id' => 359976309,
				);
				$this->requestToTelegram($dataSend, "sendMessage");
			break;
			
			
			/*	
            default:
				if( $chat_id < 0 ){
					//$dataSend = array(
					//	'text' => "Это групповой чат",
					//	'chat_id' => $chat_id,
					//);
					//$this->requestToTelegram($dataSend, "sendMessage");
					
				} else {
					$dataSend = array(
						'text' => "Нет ответа
					
Начинай тогда сначала! /start",
						'chat_id' => $chat_id,
					);
					$this->requestToTelegram($dataSend, "sendMessage");
				}
            break;*/
			
        }
    }

    /** Меняем клавиатуру Vote
     * @param $data
     * @param $emogi
     * @param $callback_query_id
     */
    private function changeVote($data, $emoji, $callback_query_id)
    {
        $text = $this->requestToTelegram($data, "editMessageReplyMarkup")
            ? "Вы проголосовали " . hex2bin($emoji)
            : "Непредвиденная ошибка, попробуйте позже.";

        $this->requestToTelegram([
            'callback_query_id' => $callback_query_id,
            'text' => $text,
            'cache_time' => 30,
        ], "answerCallbackQuery");
    }

    /** Устанавливаем новые значения Vote
     * @param $data
     * @return string
     */
    private function setParams($data)
    {
        $params = explode("_", $data);
        $params[1] ? $params[2]++ : $params[3]++;
        $arr[] = $this->getInlineKeyBoard([[
            ['text' => hex2bin('F09F918D') . ' ' . $params[2], 'callback_data' => 'vote_1_' . $params[2] . '_' . $params[3]],
            ['text' => hex2bin('F09F918E') . ' ' . $params[3], 'callback_data' => 'vote_0_' . $params[2] . '_' . $params[3]]
        ]]);
        $arr[] = $params[1] ? 'F09F918D' : 'F09F918E';
        return $arr;
    }

    /**
     * создаем inline клавиатуру
     * @return string
     */
    private function getInlineKeyBoard($data)
    {
        $inlineKeyboard = array(
            "inline_keyboard" => $data,
        );
        return json_encode($inlineKeyboard);
    }

    /**
     * создаем клавиатуру
     * @return string
     */
    private function getKeyBoard($data)
    {
        $keyboard = array(
            "keyboard" => $data,
            //"one_time_keyboard" => false,
			"one_time_keyboard" => true,
            "resize_keyboard" => true
        );
        return json_encode($keyboard);
    }

    private function setFileLog($data)
    {
        $fh = fopen('log.txt', 'a') or die('can\'t open file');
        ((is_array($data)) || (is_object($data))) ? fwrite($fh, print_r($data, TRUE) . "\n") : fwrite($fh, $data . "\n");
        fclose($fh);
    }

    /**
     * Парсим что приходит преобразуем в массив
     * @param $data
     * @return mixed
     */
    private function getData($data)
    {
        return json_decode(file_get_contents($data), TRUE);
    }

    /** Отправляем запрос в Телеграмм
     * @param $data
     * @param string $type
     * @return mixed
     */
    private function requestToTelegram($data, $type)
    {
		global $tg_token;
        $result = null;
		
		$api_url = "https://api.telegram.org/bot$tg_token/$type";

        if (is_array($data)) {
            $ch = curl_init();
            //curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $this->botToken . '/' . $type);
			curl_setopt($ch, CURLOPT_URL, $api_url);
            curl_setopt($ch, CURLOPT_POST, count($data));
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            $result = curl_exec($ch);
            curl_close($ch);
        }
        return $result;
    }
}
