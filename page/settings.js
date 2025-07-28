import { createWidget, widget } from "@zos/ui";
import { createModal, MODAL_CONFIRM } from "@zos/interaction";
import { push } from "@zos/router";
import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import EasyStorage from "@silver-zepp/easy-storage";

// Same file name as index.js
const storage = new EasyStorage("tennis_score.json");
storage.SetAutosaveEnable(true);

Page({
    build() {
        const { width: SCREEN_W, height: SCREEN_H } = getDeviceInfo();

        const BUTTON_W = SCREEN_W - px(150);
        const BUTTON_H = px(50);
        const BUTTON_SPACING = px(20);
        const TOTAL_H = BUTTON_H * 3 + BUTTON_SPACING * 2;
        const START_Y = (SCREEN_H - TOTAL_H) / 2;
        const CENTER_X = (SCREEN_W - BUTTON_W) / 2;

        // 🟦 Reset Set (Points + Games Only)
        createWidget(widget.BUTTON, {
            x: CENTER_X,
            y: START_Y,
            w: BUTTON_W,
            h: BUTTON_H,
            text: "Reset Set",
            text_size: px(20),
            radius: px(12),
            normal_color: 0x3366ff,
            press_color: 0x1144aa,
            color: 0xffffff,
            click_func: () => {
                const dialog = createModal({
                    content: "Reset the current set?",
                    autoHide: true,
                    onClick: ({ type }) => {
                        if (type === MODAL_CONFIRM) {
                            storage.setKey("p1", 0);
                            storage.setKey("p2", 0);
                            storage.setKey("games1", 0);
                            storage.setKey("games2", 0);
                            storage.setKey("inTiebreak", false);
                            push({ url: "page/index", replace: true });
                        }
                    },
                });
                dialog.show(true);
            },
        });

        // 🟥 Reset Match (points + games)
        createWidget(widget.BUTTON, {
            x: CENTER_X,
            y: START_Y + BUTTON_H + BUTTON_SPACING,
            w: BUTTON_W,
            h: BUTTON_H,
            text: "Reset Match",
            text_size: px(20),
            radius: px(12),
            normal_color: 0xcc3300,
            press_color: 0x991100,
            color: 0xffffff,
            click_func: () => {
                const dialog = createModal({
                    content: "Reset the entire match?",
                    autoHide: true,
                    onClick: ({ type }) => {
                        if (type === MODAL_CONFIRM) {
                            storage.setKey("inTiebreak", false);
                            storage.setKey("p1", 0);
                            storage.setKey("p2", 0);
                            storage.setKey("games1", 0);
                            storage.setKey("games2", 0);
                            storage.setKey("sets1", 0);
                            storage.setKey("sets2", 0);
                            push({ url: "page/index", replace: true });
                        }
                    },
                });
                dialog.show(true);
            },
        });

        // ⬅️ Back to Game
        createWidget(widget.BUTTON, {
            x: CENTER_X,
            y: START_Y + (BUTTON_H + BUTTON_SPACING) * 2,
            w: BUTTON_W,
            h: BUTTON_H,
            text: "Back to Game",
            text_size: px(20),
            radius: px(12),
            normal_color: 0x444444,
            press_color: 0x222222,
            color: 0xffffff,
            click_func: () => {
                push({ url: "page/index" });
            },
        });
    },
});
