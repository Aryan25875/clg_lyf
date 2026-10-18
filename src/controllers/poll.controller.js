const pollModel = require('../models/poll.model');

async function createPoll(req, res){
    const {title, opt} = req.body;

    const userid = req.user.id;
    if (!opt){
        return res.status(404).json({
            msg: "opt not found "
        })
    }

    let options = [];
    for (let i = 0; i < opt.length; i++){
        options.push({option_title: opt[i], votes: []});
    }

    const poll = await pollModel.create({
        title,
        author: userid,
        options
    });

    res.status(201).json({
        msg: "Poll created successfully",
        poll
    })
}

async function vote(req, res){
    const userid = req.user.id;

    const {pollid} = req.params;

    const {option} = req.body;

    const poll = await pollModel.findById(pollid);
    if (!poll){
        return res.status(404).json({
            msg : "Poll does not exist"
        })
    }

    const optInpoll = poll.options.find(
        ele => ele.option_title === option
    );

    console.log(poll);

    if (!optInpoll){
        return res.status(404).json({
            msg: "Option does not exists"
        })
    }

    const isPollAlreadyMarked = optInpoll.votes.some(
        ele => ele.toString() === userid.toString()
    )

    if (isPollAlreadyMarked){
        optInpoll.votes.pull(userid);
        await poll.save();
        return res.status(200).json({
            msg: "Successfully removed vote",
            poll
        })
    }

    poll.options.forEach(ele =>{
        ele.votes.pull(userid);
    })

    optInpoll.votes.addToSet(userid);

    await poll.save();

    return res.status(200).json({
        msg: "Successfully added your vote",
        poll
    })
}

async function getAllPolls(req, res){
    const polls = await pollModel.find().limit(20);

    res.status(200).json({
        msg: "Here are all polls",
        polls
    })
}

async function getMyPoll(req, res) {
    const userid = req.user.id;

    const polls = await pollModel.find({author:userid});
    if (!polls){
        return res.status(200).json({
            msg: "No Polls exists by you"
        })
    }

    res.status(200).json({
        msg : "Successfully retrived your polls",
        polls
    })
}

module.exports = {createPoll, vote, getAllPolls, getMyPoll};


