import React from "react";
import { Button, Card, Col, Rate, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { teamMembersList } from "../../stub-data/data";

export const TeamMembersFeedBack = () => {
  return (
    <>
      <Row>
        <Col span={8}>
          {/* <TextField label="Search by Name" style={{ width: 350 }} /> */}
          {teamMembersList.map((member) => (
            <Card
              key={member.id}
              // variant="outlined"
              // onClick={(event) => {
              //   matchId(member.id, member.attributes.name);
              // }}
              // sx={{
              //   borderRadius: "2px",
              //   marginTop: "1rem",
              //   width: "95%",
              //   height: "4%",
              //   py: 2,
              //   pl: 2,
              //   bgcolor:
              //     active && id === member.id
              //       ? "rgba(198, 203, 230, 0.75)"
              //       : "rgba(189, 189, 189, 0.15)",
              // }}
              className="member-card"
            >
              <p>{member.name}</p>
            </Card>
          ))}
        </Col>
        <Col span={16}>
          <div>
            <p>Feedback for</p>
            <p>{name}</p>
          </div>
          <Row>
            <Col span={10}>
              <p>Positives</p>
              <TextArea
                placeholder="Your Message"
                rows={4}
                style={{ width: 400 }}
                // fullWidth
                // multiline
              />
            </Col>
            <Col span={10}>
              <p>Areas of Improvement</p>
              <TextArea
                style={{ width: 400 }}
                rows={4}
                fullWidth
                placeholder="Your Message"
                multiline
              />
            </Col>
          </Row>
          <Row>
            <p>Overall rating</p>
            <Rate size="large" />
            <div>
              <Button>Reset</Button>
              <Button>Save</Button>
            </div>
          </Row>
        </Col>
      </Row>
      <Row>
        <Button>
          {/* <ArrowBackIcon sx={{ ml: 1 }} /> */}
          Back
        </Button>
        <Button>
          SUBMIT
          {/* <ArrowForwardIcon sx={{ ml: 1 }} /> */}
        </Button>
      </Row>
    </>
  );
};
