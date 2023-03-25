<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait StorageImageTrait
{
    private $gClient;

    public function storageTraitUpload(Request $request, $folderId, $keyGoogleDrive)
    {
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
        //

        $service = new \Google_Service_Drive($this->gClient);

        $keyGoogleDrive = json_decode($keyGoogleDrive, true);
        $this->gClient->setAccessToken($keyGoogleDrive);

        if ($this->gClient->isAccessTokenExpired()) {

            // SAVE REFRESH TOKEN TO SOME VARIABLE
            $refreshTokenSaved = $this->gClient->getRefreshToken();

            // UPDATE ACCESS TOKEN
            $this->gClient->fetchAccessTokenWithRefreshToken($refreshTokenSaved);

            // PASS ACCESS TOKEN TO SOME VARIABLE
            $updatedAccessToken = $this->gClient->getAccessToken();

            // APPEND REFRESH TOKEN
            $updatedAccessToken['refresh_token'] = $refreshTokenSaved;

            // SET THE NEW ACCES TOKEN
            $this->gClient->setAccessToken($updatedAccessToken);

            file_put_contents(storage_path('app/public/KeyGGDrive.txt'), json_encode($updatedAccessToken));
        }

        $files = $request->file('images');
        $listImage = [];

        foreach($files as $fileUpload) {
            $nameFile = Str::random(20). '.' . $fileUpload->getClientOriginalExtension();
            $file = new \Google_Service_Drive_DriveFile(array(
                'name' => $nameFile, 
                'parents' => array($folderId)
            ));
    
            $result = $service->files->create($file, array(
                'data' => file_get_contents($fileUpload), // ADD YOUR FILE PATH WHICH YOU WANT TO UPLOAD ON GOOGLE DRIVE
                'mimeType' => 'application/octet-stream',
                'uploadType' => 'media'
            ));
    
            $listImage[] = [
                'id' => $result->id,
                'name' => $nameFile
            ];

            // Set file as public
            $permission = new \Google_Service_Drive_Permission();
            $permission->setRole('reader');
            $permission->setType('anyone');
            $permission->setAllowFileDiscovery(false);
            $service->permissions->create($result->id, $permission);
        }
        return $listImage;
    }
}
