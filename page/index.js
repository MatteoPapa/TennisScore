// index.js
import { getDeviceInfo } from "@zos/device";
import { createWidget, widget, prop, align, event } from "@zos/ui";
import { px } from "@zos/utils";
import EasyStorage from "@silver-zepp/easy-storage";
import { push } from "@zos/router";
import { setWakeUpRelaunch } from "@zos/display";

setWakeUpRelaunch({ relaunch: true });

const storage = new EasyStorage("tennis_score.json");
storage.SetAutosaveEnable(true);

let p1 = 0,
    p2 = 0;
let games1 = 0,
    games2 = 0;
let sets1 = 0,
    sets2 = 0,
    inTiebreak = false;

const scoreDisplay = ["0", "15", "30", "40", "Adv", "Game"];
let p1ScoreText, p2ScoreText;

function persist() {
    storage.setKey("p1", p1);
    storage.setKey("p2", p2);
    storage.setKey("games1", games1);
    storage.setKey("games2", games2);
    storage.setKey("sets1", sets1);
    storage.setKey("sets2", sets2);
    storage.setKey("inTiebreak", inTiebreak);
}

function restore() {
    p1 = storage.getKey("p1", 0);
    p2 = storage.getKey("p2", 0);
    games1 = storage.getKey("games1", 0);
    games2 = storage.getKey("games2", 0);
    sets1 = storage.getKey("sets1", 0);
    sets2 = storage.getKey("sets2", 0);
    inTiebreak =
        storage.getKey("inTiebreak", false) === true ||
        storage.getKey("inTiebreak", false) === "true";
}

Page({
    onInit() {
        // Relaunch app when screen is turned on again
        setWakeUpRelaunch({ relaunch: true });
    },
    build() {
        const { width: SCREEN_W, height: SCREEN_H } = getDeviceInfo();
        const centerX = SCREEN_W / 2;
        const centerY = SCREEN_H / 2;

        // PLAYER 1
        createWidget(widget.BUTTON, {
            x: 0,
            y: 0,
            w: SCREEN_W / 2,
            h: SCREEN_H,
            normal_color: 0x003366,
            press_color: 0x001c38,
            click_func: () => addPoint(1),
        });

        removePointButton1 = createWidget(widget.BUTTON, {
            x: 0,
            y: centerY + SCREEN_H / 4 - px(50),
            w: SCREEN_W / 2,
            h: 50,
            color: 0xffffff,
            normal_color: 0x001c38,
            press_color: 0x000f1f,
            text: "-",
            text_size: 20,
            click_func: () => removePoint(1),
        });

        let p1SummaryText = createWidget(widget.TEXT, {
            x: 0,
            y: SCREEN_H / 2 - px(80),
            w: SCREEN_W / 2,
            h: px(40),
            text: `${sets1} | ${games1} `,
            text_size: 22,
            color: 0xffffff,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
        });
        p1SummaryText.addEventListener(event.CLICK_DOWN, () => addPoint(1));

        p1ScoreText = createWidget(widget.TEXT, {
            x: 0,
            y: SCREEN_H / 2 - px(30),
            w: SCREEN_W / 2,
            h: px(60),
            text: scoreDisplay[p1],
            text_size: 60,
            color: 0xffffff,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
        });
        p1ScoreText.addEventListener(event.CLICK_DOWN, () => addPoint(1));

        // PLAYER 2
        createWidget(widget.BUTTON, {
            x: centerX,
            y: centerY - SCREEN_H / 2,
            w: SCREEN_W / 2,
            h: SCREEN_H,
            normal_color: 0x663300,
            press_color: 0x452200,
            click_func: () => addPoint(2),
        });

        removePointButton2 = createWidget(widget.BUTTON, {
            x: centerX,
            y: centerY + SCREEN_H / 4 - px(50),
            w: SCREEN_W / 2,
            h: 50,
            color: 0xffffff,
            normal_color: 0x452200,
            press_color: 0x2e1700,
            text: "-",
            text_size: 20,
            click_func: () => removePoint(2),
        });

        let p2SummaryText = createWidget(widget.TEXT, {
            x: centerX,
            y: SCREEN_H / 2 - px(80),
            w: SCREEN_W / 2,
            h: px(40),
            text: `${sets2} | ${games2} `,
            text_size: 22,
            color: 0xffffff,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
        });
        p2SummaryText.addEventListener(event.CLICK_DOWN, () => addPoint(2));

        p2ScoreText = createWidget(widget.TEXT, {
            x: centerX,
            y: centerY - px(30),
            w: SCREEN_W / 2,
            h: px(60),
            text: scoreDisplay[p2],
            text_size: 60,
            color: 0xffffff,
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
        });
        p2ScoreText.addEventListener(event.CLICK_DOWN, () => addPoint(2));

        //SETTINGS
        createWidget(widget.BUTTON, {
            x: centerX - SCREEN_W / 2,
            y: centerY + SCREEN_H / 4,
            w: SCREEN_W,
            h: SCREEN_H / 4,
            normal_color: 0x0f0f0f,
            press_color: 0x0e0e0e,
            color: 0xffffff,
            text: "Settings",
            text_size: 20,
            text_w: 10,
            click_func: () => {
                push({
                    url: "page/settings",
                });
            },
        });

        // createWidget(widget.ARC, {
        //     x:centerX - SCREEN_W/2,
        //     y:centerY - SCREEN_H/2,
        //     w:SCREEN_W,
        //     h:SCREEN_H,
        //     radius: SCREEN_W,
        //     start_angle: 0,
        //     end_angle: 360,
        //     line_width: 4,
        //     color:0x000000
        // });

        const updateUI = () => {
            let p1Text = "";
            let p2Text = "";

            if (inTiebreak) {
                p1Text = String(p1);
                p2Text = String(p2);
            } else {
                p1Text = scoreDisplay[p1];
                p2Text = scoreDisplay[p2];
            }

            p1ScoreText.setProperty(prop.MORE, { text: p1Text });
            p2ScoreText.setProperty(prop.MORE, { text: p2Text });

            p1SummaryText.setProperty(prop.MORE, {
                text: `${sets1} | ${games1}`,
            });
            p2SummaryText.setProperty(prop.MORE, {
                text: `${sets2} | ${games2}`,
            });

            persist();
        };

        restore();
        updateUI();

        const resetGame = () => {
            p1 = 0;
            p2 = 0;
            updateUI();
        };

        const addPoint = (player) => {
            if (inTiebreak) {
                if (player === 1) p1++;
                else p2++;

                if ((p1 >= 7 || p2 >= 7) && Math.abs(p1 - p2) >= 2) {
                    if (p1 > p2) sets1++;
                    else sets2++;
                    resetGame();
                    games1 = 0;
                    games2 = 0;
                    inTiebreak = false;
                }
            } else {
                if (player === 1) p1++;
                else p2++;

                if (p1 >= 3 && p2 >= 3) {
                    if (p1 === p2) {
                        p1 = 3;
                        p2 = 3;
                    } else if (p1 === 5) {
                        games1++;
                        resetGame();
                    } else if (p2 === 5) {
                        games2++;
                        resetGame();
                    }
                } else {
                    if (p1 > 3 && p1 - p2 >= 2) {
                        games1++;
                        resetGame();
                    } else if (p2 > 3 && p2 - p1 >= 2) {
                        games2++;
                        resetGame();
                    }
                }

                // Check for tiebreak trigger
                if (games1 === 6 && games2 === 6) {
                    inTiebreak = true;
                    p1 = 0;
                    p2 = 0;
                }

                // Win by 2 rule for set
                if (!inTiebreak) {
                    if (games1 >= 6 && games1 - games2 >= 2) {
                        sets1++;
                        games1 = 0;
                        games2 = 0;
                        p1 = 0;
                        p2 = 0;
                    } else if (games2 >= 6 && games2 - games1 >= 2) {
                        sets2++;
                        games1 = 0;
                        games2 = 0;
                        p1 = 0;
                        p2 = 0;
                    }
                }
            }

            updateUI();
        };

        const removePoint = (player) => {
            if (player === 1 && p1 > 0) p1--;
            else if (player === 2 && p2 > 0) p2--;
            updateUI();
        };
    },
});
