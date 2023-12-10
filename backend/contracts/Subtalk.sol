// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

//subtalk contract for maintaining user meetings and meeting notes
contract Subtalk {
    // User struct for storing the user metadata and the details
     struct User {
        uint id;
        string username;
        address account;
        string metadata;
    }
    
    // MeetingSummary struct for storing meeting summary and details
    struct MeetingSummary {
        uint id;
        address owner;
        string content;
        uint created;
    }

    // mapping for Users 
    mapping(uint => User) private users;
    // mapping for meeting summary
    mapping(uint => MeetingSummary) private sumarries;

    uint nextUserId = 0;
    uint nextMeetingId = 0;

    // event Usercreated to be emited once user is created
    event UserCreated(uint id, string username, address account, string metadata);
    // event MeetingCreated to be emited once meeting summary is generated
    event MeetingCreated(uint id, address owner,string content, uint created);

    // 
    function createUser(string memory name,string memory metadata) public {
        uint id = nextUserId;
        users[id] = User(id, name, msg.sender, metadata);
        nextUserId += 1;
        emit UserCreated(id, name, msg.sender, metadata);
    }

    function createMeetingSummary(string memory content) public  {
        uint id = nextMeetingId;
        sumarries[id] = MeetingSummary(id,msg.sender,content, block.timestamp);
        nextMeetingId += 1;
        emit MeetingCreated(id,msg.sender,content, block.timestamp);    
    }

    function getMeetingsSummariesByUser() public view returns ( MeetingSummary[] memory) {
        MeetingSummary[] memory userMeeetings = new MeetingSummary[](nextMeetingId);
        uint numMeetings = 0;
        for (uint i = 0; i < nextMeetingId; i++) {
            if (sumarries[i].owner == msg.sender) {
                userMeeetings[numMeetings] = sumarries[i];
                numMeetings += 1;
            }
        }
        // MeetingSummary[] memory result = new  MeetingSummary[](numMeetings);
        // for (uint i = 0; i < numMeetings; i++) {
        //     result[i] = numMeetings[i];
        // }
        return userMeeetings;
    }
    function getMeeting() public view returns ( MeetingSummary[] memory) {
        MeetingSummary[] memory result = new  MeetingSummary[](nextMeetingId);
        for (uint i = 0; i < nextMeetingId; i++) {
            result[i] = sumarries[i];
        }
        return result;
    } 
    function getUsers() public view returns ( User[] memory) {
        User[] memory result = new  User[](nextUserId);
        for (uint i = 0; i < nextUserId; i++) {
            result[i] = users[i];
        }
        return result;
    }
}