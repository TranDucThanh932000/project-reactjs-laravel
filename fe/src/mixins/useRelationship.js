import { useState } from "react";
import store from "../store";
import { useNavigate } from "react-router-dom";
import { StatusFriend } from "../utils/constants";
import * as friendService from '../services/friendService';
import * as followService from '../services/followService';
import * as userService from "../services/userService";
import {
    updateListRankingFollower,
    updateListFriend,
    setNotification
} from "../store/actions/commonAction";

const LOADING_STATUS_FRIEND = 9999;
const LOADING_STATUS_FOLLOW_FRIEND = 9999;

function useRelationship(props) {
    const [relationship, setRelationship] = useState({
        status: LOADING_STATUS_FRIEND
    });
    const [followStatus, setFollowStatus] = useState(LOADING_STATUS_FOLLOW_FRIEND);
    const navigate = useNavigate();
    
    const handleAddFriend = (id) => {
        setRelationship({
        status: LOADING_STATUS_FRIEND
        });
        if(!props.currentUser) {
            navigate('/login');
        return;
        }
    
        friendService.addFriend(id)
        .then(() => {
        setRelationship({
            status: StatusFriend.WAITTING,
            friend: id,
            user_id: props.currentUser.id
        });
        });
    
        let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
        let index = newListFL.findIndex(x => x.user_id == id);
        if(index >= 0) {
            newListFL[index].user.friend = [];
            newListFL[index].user.is_add_friend = [
            {
                user_id: props.currentUser.id,
                friend: id,
                status: StatusFriend.WAITTING
            }
            ];
            store.dispatch(updateListRankingFollower(newListFL));
        }
    }
    
    const handleUnFriend = (friend) => {
        setRelationship({
        status: LOADING_STATUS_FRIEND
        });
        friendService.unFriend(friend)
        .then(() => {
        setRelationship({
            status: 0
        });
        })
    
        let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
        let index = newListFL.findIndex(x => x.user_id == friend);
        if(index >= 0) {
            newListFL[index].user.friend = [];
            newListFL[index].user.is_add_friend = [];
            store.dispatch(updateListRankingFollower(newListFL));
        }
    }
    
    const handleCancelRequestFriend = (friend) => {
        setRelationship({
        status: LOADING_STATUS_FRIEND
        });
        friendService.cancelRequest(friend)
        .then(() => {
        setRelationship({
            status: 0
        });
        })
    
        let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
        let index = newListFL.findIndex(x => x.user_id == friend);
        if(index >= 0) {
            newListFL[index].user.friend = [];
            newListFL[index].user.is_add_friend = [];
            store.dispatch(updateListRankingFollower(newListFL));
        }
        let newListNotification = props.notifications.map(x => {
            if (x.userId == friend) {
                x.is_waiting = false;
            }
            return x;
        })
        store.dispatch(setNotification(newListNotification));
    }
    
    const handleAcceptRequestFriend = (friend) => {
        setRelationship({
        status: LOADING_STATUS_FRIEND
        });
        friendService.acceptRequest(friend)
        .then(() => {
        setRelationship({
            status: StatusFriend.ACCEPTED
        });
        //reload list friend
        userService.getListFriend(props.currentUser.id).then((data) => {
            store.dispatch(updateListFriend(data));
        });
        })
    
        let newListFL = [...props.listFollowerRanking];
        let index = newListFL.findIndex(x => x.user_id == friend);
        if(index >= 0) {
            newListFL[index].user.friend = [];
            newListFL[index].user.is_add_friend = [
            {
                user_id: friend,
                friend: props.currentUser.id,
                status: StatusFriend.ACCEPTED
            }
            ];
            store.dispatch(updateListRankingFollower(newListFL));
        }
        let newListNotification = props.notifications.map(x => {
            if (x.userId == friend) {
                x.is_waiting = false;
            }
            return x;
        })
        store.dispatch(setNotification(newListNotification));
    }

    const handleFollow = (friend) => {
        if(!props.currentUser) {
        navigate('/login');
        return;
        }
    
        setFollowStatus(LOADING_STATUS_FOLLOW_FRIEND);
        followService.follow(friend)
        .then(() => {
        setFollowStatus(true);
        });
    
        let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
        let index = newListFL.findIndex(x => x.user_id == friend);
        if(index >= 0) {
            newListFL[index].followed = true;
            store.dispatch(updateListRankingFollower(newListFL));
        }
    }
    
    const handleUnFollow = (friend) => {
        setFollowStatus(LOADING_STATUS_FOLLOW_FRIEND);
        followService.unfollow(friend)
        .then(() => {
        setFollowStatus(false);
        });
    
        let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
        let index = newListFL.findIndex(x => x.user_id == friend);
        if(index >= 0) {
            newListFL[index].followed = false;
            store.dispatch(updateListRankingFollower(newListFL));
        }
    }

    return { 
        handleAddFriend, 
        handleUnFriend, 
        handleCancelRequestFriend, 
        handleAcceptRequestFriend, 
        handleFollow, 
        handleUnFollow,
        setRelationship,
        setFollowStatus,
        relationship,
        followStatus
    }
}

export default useRelationship;