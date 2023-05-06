import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';

const actions = [
  { icon: <FacebookOutlinedIcon />, name: 'Facebook', key: 'facebook' },
  { icon: <ContactPhoneOutlinedIcon />, name: 'Liên hệ tới Admin', key: 'contact' },
  { icon: <PlayCircleOutlineOutlinedIcon />, name: 'Chơi nhạc', key: 'audio' },
];

export default function SpeedDialCompontent() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [audios, setAudios] = React.useState([
    {
        id: '1_rF4v4EPrzIxs75zSwKmUN6W2mhXvRay',
        name: 'cupid',
        singer: 'FIFTY FIFTY'
    }
  ]);
  const [audioPlaying, setAudioPlaying] = React.useState(audios[0].id);
  const [statusPlaying, setStatusPlaying] = React.useState(false);
  const handleClose = (key) => {
    var aud = document.getElementById("myAudio");
    switch(key) {
        case 'facebook': {
            window.open("https://www.facebook.com", "_blank");
            break;
        }
        case 'contact': {
            console.log('contact')
            break;
        }
        case 'play-audio': {
            aud.play();
            setStatusPlaying(true);
            break;
        }
        case 'pause-audio': {
            aud.pause();
            setStatusPlaying(false);
            break;
        }
        default: {
            break;
        }
    }
    setOpen(false);
  };

  return (
    <Box>
      <SpeedDial
        ariaLabel=""
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
            action.key !== 'audio'?
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handleClose(action.key)}
            />
            :
            (! statusPlaying ?             
                <SpeedDialAction
                    key={'Phát nhạc'}
                    icon={<PlayCircleOutlineOutlinedIcon />}
                    tooltipTitle={'Phát nhạc'}
                    onClick={() => handleClose('play-audio')}
                />
                :
                <SpeedDialAction
                    key={'Dừng phát nhạc'}
                    icon={<PauseCircleOutlineOutlinedIcon />}
                    tooltipTitle={'Dừng phát nhạc'}
                    onClick={() => handleClose('pause-audio')}
                />
            )
        ))}
      </SpeedDial>
        <audio style={{ visibility: 'hidden' }} controls preload="metadata" id="myAudio">
            <source src={`https://docs.google.com/uc?id=${audioPlaying}`} type="audio/mpeg" />
        </audio>
    </Box>
  );
}