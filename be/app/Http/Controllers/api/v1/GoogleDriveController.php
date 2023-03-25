<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GoogleDriveController extends Controller
{
    public $gClient;

    function __construct(){
        
        $this->gClient = new \Google_Client();
        
        $this->gClient->setApplicationName('myapp'); // ADD YOUR AUTH2 APPLICATION NAME (WHEN YOUR GENERATE SECRATE KEY)
        $this->gClient->setClientId('1043412069890-pak7fkelo79g0o0eaqbald1e6pvsdh0s.apps.googleusercontent.com');
        $this->gClient->setClientSecret('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');
        $this->gClient->setRedirectUri(route('google.login'));
        $this->gClient->setDeveloperKey('AIzaSyBoRb3wU0c_ZzpStSumt9ygSsS1s2fXBf0');
        $this->gClient->setScopes(array(               
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive'
        ));
        
        $this->gClient->setAccessType("offline");
        
        $this->gClient->setApprovalPrompt("force");
    }

    public function googleLogin(Request $request)  {
        $google_oauthV2 = new \Google_Service_Oauth2($this->gClient);

        if ($request->get('code')){
            $this->gClient->authenticate($request->get('code'));
            session()->put('token', $this->gClient->getAccessToken());
        }

        if (session()->get('token')){
            $this->gClient->setAccessToken(session()->get('token'));
        }

        if ($this->gClient->getAccessToken()){
            //FOR LOGGED IN USER, GET DETAILS FROM GOOGLE USING ACCES
            file_put_contents(storage_path('app/public/KeyGGDrive.txt'), json_encode(session()->get('token')));

            return true;
        
        } else{
            // FOR GUEST USER, GET GOOGLE LOGIN URL
            $authUrl = $this->gClient->createAuthUrl();

            return redirect()->to($authUrl);
        }
    }
}
