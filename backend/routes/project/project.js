const router = require("express").Router();
const Project = require("../../models/Project");

router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res
      .status(200)
      .send({ status: "200", message: "Successfully created Project" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.id });
    res.status(200).send({ status: "200", message: projects });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    res.status(200).send({ status: "200", message: projects });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "200", message: "Successful" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

module.exports = router;
