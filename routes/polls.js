const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const polls = require('../controllers/getPolls');
const Conn = require('../models/Conn_US');
const Survey = require('../models/Survey')



// Your Polls list
router.get('/yourPolls', ensureAuthenticated, function(req, res) {
    polls.list(req,res);
});

router.get('/yourPolls/:id', ensureAuthenticated ,(req, res) => 
    res.render('yourpolls/managePolls', {
        id: req.params.id
    }));

router.get('/yourPolls/:id/invate', ensureAuthenticated, function(req, res){
    polls.users(req,res);
});

router.post('/yourPolls/addTo/:id', (req, res) => {
    // const userId = req.body.currentUser
    // let pollId = req.params.id
    // console.log(`ID usera: ${userId}`);
    // console.log(`ID ankiety: ${pollId}`);

    const newConn = new Conn({
        u_id: req.body.currentUser,
        s_id: req.params.id
    });

    newConn.save()
        .then(Conn => {
            req.flash('success_msg', 'You invated new user');
            res.redirect('back');
        })
        .catch(err => console.log(err));
})

router.get('/yourPolls/:id/invatedUsers', ensureAuthenticated, function(req, res){
    polls.invated(req,res);
});

router.get('/yourPolls/:id/answers', ensureAuthenticated, function(req, res){
    polls.answers(req,res);
});

router.get('/yourPolls/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
        const surveyId = req.params.id; // Pobranie ID ankiety
        console.log(`Deleting survey with ID: ${surveyId}`);
        
        // Usunięcie ankiety
        await Survey.findByIdAndDelete(surveyId);
        req.flash('success_msg', 'Survey deleted successfully');
        res.redirect('/polls/yourPolls'); // Przekierowanie na listę ankiet
    } catch (err) {
        console.error('Error deleting survey:', err);
        req.flash('error_msg', 'Failed to delete survey');
        res.redirect('/polls/yourPolls');
    }
});



module.exports = router;