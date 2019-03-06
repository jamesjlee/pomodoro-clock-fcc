import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Container, Row, Col, Button, ButtonGroup } from "reactstrap";

class App extends Component {
  state = {
    breakLength: 5,
    sessionLength: 25,
    timeLeft: "25:00",
    breakLeft: "5:00",
    startedClock: false,
    intervals: [],
    interval: null,
    sessionFinished: false,
    breakFinished: false,
    timerIsOver: false,
    freshTimer: false
  };

  timeHelper = (minutes) => {
    if (this.state.freshTimer) {
      minutes = minutes + 1;
      let displaySeconds = "00";
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return minutes + ":" + displaySeconds;
    } else {
      let displaySeconds = "00";
      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return minutes + ":" + displaySeconds;
    }
  };

  handleResetClick = (e) => {
    clearInterval(this.state.interval);
    let beep = document.getElementById("beep");
    beep.pause();
    beep.load();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: "25:00",
      breakLeft: "5:00",
      startedClock: false,
      sessionFinished: false,
      breakFinished: false
    });
  };

  beginBreak = () => {
    this.setState({
      sessionFinished: !this.state.sessionFinished,
      freshTimer: true
    });
    this.calculateTimeLeft(this.timeHelper(this.state.breakLength));
  };

  beginSession = () => {
    this.setState({
      sessionFinished: !this.state.sessionFinished,
      freshTimer: true
    });
    this.calculateTimeLeft(this.timeHelper(this.state.sessionLength));
  };

  calculateTimeLeft = (timeLeft) => {
    console.log(timeLeft);
    let minutes = timeLeft.split(":")[0];
    let seconds = timeLeft.split(":")[1];

    let interval = setInterval(() => {
      if (!this.state.freshTimer) {
        if (seconds == "00" && minutes !== "00") {
          minutes -= 1;
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          seconds = 60;
        }

        seconds -= 1;
      } else {
        let timeout = setTimeout(() => {
          if (seconds >= 0 && minutes >= 0 && this.state.sessionFinished) {
            console.log(minutes + ":" + seconds);
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            this.setState({
              breakLeft: minutes + ":" + seconds
            });
          } else if (
            seconds >= 0 &&
            minutes >= 0 &&
            !this.state.sessionFinished
          ) {
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            this.setState({
              timeLeft: minutes + ":" + seconds
            });
          }
        }, 1000);
        clearTimeout(timeout);
        if (seconds == "00" && minutes !== "00") {
          minutes -= 1;
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          seconds = 60;
        }
        seconds -= 1;
      }

      if (seconds >= 0 && minutes >= 0 && this.state.sessionFinished) {
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.setState({
          breakLeft: minutes + ":" + seconds
        });
      } else if (seconds >= 0 && minutes >= 0 && !this.state.sessionFinished) {
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.setState({
          timeLeft: minutes + ":" + seconds
        });
      }

      if (seconds == "00" && minutes == "00") {
        if (!this.state.sessionFinished) {
          this.setState({
            timeLeft: "00" + ":" + "00",
            breakLeft: "00" + ":" + "00"
          });
          let beep = document.getElementById("beep");
          beep.pause();
          beep.play();
          this.beginBreak();
        } else if (this.state.sessionFinished) {
          this.setState({
            timeLeft: "00" + ":" + "00",
            breakLeft: "00" + ":" + "00"
          });
          let beep = document.getElementById("beep");
          beep.pause();
          beep.play();
          this.beginSession();
        }
      }
    }, 1000);

    this.setState({
      interval: interval
    });
  };

  handleStartStopClick = (e, clockStarted) => {
    let interval;
    if (this.state.startedClock) {
      clearInterval(this.state.interval);
    } else {
      if (this.state.sessionFinished) {
        this.calculateTimeLeft(this.state.breakLeft);
      } else {
        this.calculateTimeLeft(this.state.timeLeft);
      }
    }

    this.setState({
      startedClock: !this.state.startedClock
    });
  };

  handleBreakIncrementClick = (e) => {
    if (this.state.breakLength + 1 > 60) {
      return;
    }

    if (this.state.breakLength + 1 < 10) {
      this.setState({
        breakLength: this.state.breakLength + 1,
        breakLeft: "0" + (this.state.breakLength + 1) + ":00"
      });
      return;
    }

    this.setState({
      breakLength: this.state.breakLength + 1,
      breakLeft: this.state.breakLength + 1 + ":00"
    });
  };

  handleBreakDecrementClick = (e) => {
    if (this.state.breakLength - 1 <= 0) {
      return;
    }

    if (this.state.breakLength - 1 < 10) {
      this.setState({
        breakLength: this.state.breakLength - 1,
        breakLeft: "0" + (this.state.breakLength - 1) + ":00"
      });
      return;
    }

    this.setState({
      breakLength: this.state.breakLength - 1,
      breakLeft: this.state.breakLength - 1 + ":00"
    });
  };

  handleSessionDecrementClick = (e) => {
    if (this.state.sessionLength - 1 <= 0) {
      return;
    }

    if (this.state.sessionLength - 1 < 10) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        timeLeft: "0" + (this.state.sessionLength - 1) + ":00"
      });
      return;
    }

    this.setState({
      sessionLength: this.state.sessionLength - 1,
      timeLeft: this.state.sessionLength - 1 + ":00"
    });
  };

  handleSessionIncrementClick = (e) => {
    if (this.state.sessionLength + 1 > 60) {
      return;
    }

    if (this.state.sessionLength + 1 < 10) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        timeLeft: "0" + (this.state.sessionLength + 1) + ":00"
      });
      return;
    }

    this.setState({
      sessionLength: this.state.sessionLength + 1,
      timeLeft: this.state.sessionLength + 1 + ":00"
    });
  };

  render() {
    return (
      <Container id="pomodoro-clock" className="PomodoroClockContainer">
        <div id="title">Pomodoro Clock: </div>
        <Row className="PomodoroClockRow">
          <Col xs="6" className="PomodoroClock">
            <div id="timer-label">
              {this.state.sessionFinished ? "Break" : "Session"}
            </div>
            <div id="time-left">
              {this.state.sessionFinished
                ? this.state.breakLeft
                : this.state.timeLeft}
            </div>
            <ButtonGroup>
              <Button
                id="start_stop"
                size="lg"
                onClick={(e) => this.handleStartStopClick(e)}
              >
                {this.state.startedClock ? "Stop" : "Start"}
              </Button>
              <Button
                id="reset"
                size="lg"
                onClick={(e) => this.handleResetClick(e)}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="ClockControlsRow">
          <Col xs="6" className="ClockControls">
            <div id="break-label">Break Length</div>
            <ButtonGroup>
              <Button
                size="lg"
                id="break-increment"
                onClick={(e) => this.handleBreakIncrementClick(e)}
              >
                Inc.
              </Button>
              <Button
                size="lg"
                id="break-decrement"
                onClick={(e) => this.handleBreakDecrementClick(e)}
              >
                Dec.
              </Button>
            </ButtonGroup>
            <div id="break-length">{this.state.breakLength}</div>
          </Col>
          <Col xs="6" className="ClockControls">
            <div id="session-label">Session Length</div>
            <ButtonGroup>
              <Button
                size="lg"
                id="session-increment"
                onClick={(e) => this.handleSessionIncrementClick(e)}
              >
                Inc.
              </Button>
              <Button
                size="lg"
                id="session-decrement"
                onClick={(e) => this.handleSessionDecrementClick(e)}
              >
                Dec.
              </Button>
            </ButtonGroup>
            <div id="session-length">{this.state.sessionLength}</div>
          </Col>
        </Row>
        <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
      </Container>
    );
  }
}

export default App;
