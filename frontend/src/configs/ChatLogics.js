export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderInfo = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSameSender = (messages, message, i, userId) => {
    return (
        i < messages.length - 1 && (messages[i+1].sender._id !== message.sender._id || 
        messages[i+1].sender._id === undefined) && messages[i].sender._id !== userId
    );
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 && messages[messages.length-1].sender._id !== userId && messages[messages.length-1].sender._id
    );
}

export const isSameSenderMargin = (messages, message, i, userId) => {
    if(
        i < messages.length - 1 && messages[i+1].sender._id === message.sender._id && 
        messages[i].sender._id !== userId
    )
    {
        return 33;
    }
    else if( (i < messages.length - 1 && messages[i+1].sender._id !== message.sender._id && 
        messages[i].sender._id !== userId) || (i === messages.length - 1 && messages[i].sender._id !== userId)){
        return 0;
    }
    else{
        return 'auto';
    }
}

export const isSameUser = (messages, message, i) => {
    return i>0 && messages[i-1].sender._id === message.sender._id;
}

export const formatTime = (utcTime) => {
    console.log(utcTime)
    let istTime = new Date(utcTime);
    console.log(istTime)

    // Get current IST time
    let now = new Date();

    // Calculate the time difference in milliseconds
    let timeDiff = now - istTime;

    // Convert time difference to hours
    let hoursDiff = timeDiff / (1000 * 60 * 60);

    // If less than 24 hours, display time
    if (hoursDiff < 24) {
        let hours = istTime.getHours() % 12 || 12;
        let minutes = istTime.getMinutes();
        let amPm = istTime.getHours() >= 12 ? 'PM' : 'AM';

        // Construct the time string in 12-hour format
        let timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`;

        return timeString;
    } 
    // If yesterday, display 'Yesterday'
    else if (istTime.getDate() === now.getDate() - 1) {
        return 'Yesterday';
    } 
    // If not yesterday, display the date
    else {
        let month = istTime.getMonth() + 1; // Month is 0-indexed
        let day = istTime.getDate();
        let year = istTime.getFullYear();
        return `${day}/${month}/${year}`;
    }
}