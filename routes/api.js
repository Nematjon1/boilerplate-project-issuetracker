'use strict';
const { ObjectID } = require('mongodb');

module.exports = function(app, myDataBase) {

    app.route('/api/issues/:project')

        .get(function(req, res) {
            let project = req.params.project;
            if(project !== "") {
                const collection = myDataBase.collection(project);
                collection.find({}).toArray((err, data) => {
                    if(!!err) {
                        return res.json({"error": "Server error, please try later"});
                    } else if(!!data) {
                        return res.json(data);
                    }
                })

            } else {
                return res.json([]);
            }

        })

        .post(function(req, res) {
            let project = req.params.project;
            const {
                issue_title,
                issue_text,
                created_by,
                assigned_to, // optional
                status_text // optional
            } = req.body;

            if(!issue_text || !issue_title || !created_by) {
                return res.json({ error: 'required field(s) missing' });
            }

            if(project !== "") {
                const collection = myDataBase.collection(project);
                collection.insertOne({
                    issue_text,
                    issue_title,
                    created_by,
                    status_text: status_text || "",
                    open: !!status_text ? (status_text === "open" ? true:false) : true,
                    assigned_to: assigned_to || "",
                    created_on: new Date().toISOString(),
                    updated_on: new Date().toISOString()
                }, (err, data) => {
                    if(err) {
                        return res.json({"error": "Server error, please try later"})
                    } else if(data) {
                        return res.status(200).json(data.ops[0]);
                    }
                })

            } else {
                return res.json([]);
            }

        })

        .put(function(req, res) {
            let project = req.params.project;
            let {
                _id,
                issue_text,
                issue_title,
                created_by,
                assigned_to,
                status_text,
                open
            } = req.body;

            const collection = myDataBase.collection(project);

            if(!_id) {
                return res.status(404).json({ error: 'missing _id' });
            } else if(!issue_text && !issue_title && !created_by && !assigned_to && !status_text) {
                return res.status(404).json({error: 'no update field(s) sent', '_id': _id })
            } else {
                collection.findOneAndUpdate({_id: new ObjectID(_id)}, {
                    $setOnInsert: {
                        updated_on: new Date().toISOString(),
                        
                    }

                })
            }
        })

        .delete(function(req, res) {
            let project = req.params.project;
            let id = req.body._id;
            const collection = myDataBase.collection(project);

            if(!id) {
                return res.status(404).json({ error: 'missing _id' });;
            }

            if(project !== "") {
                collection.deleteOne({_id: new ObjectID(id)}, (err, data) => {
                    if(!!err) {
                        return res.json({ error: 'could not delete', '_id': id })
                    }

                    if(!!data) {
                        return res.json({ result: 'successfully deleted', '_id': id });
                    }
                })
            }

        });

};

const testUser =     {
      issue_text: 'Test',
      issue_title: 'Test case',
      created_by: 'John Doeee',
      status_text: 'open',
      asigned_to: '',
      created_on: '2021-01-24T14:08:20.579Z',
      updated_on: '2021-01-24T14:08:20.579Z',
      _id: "600d7f5465764303979fc463"
    };
