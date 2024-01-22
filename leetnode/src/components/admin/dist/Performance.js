"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var auto_1 = require("chart.js/auto");
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var react_hot_toast_1 = require("react-hot-toast");
var DateDiffCalc_1 = require("@/utils/DateDiffCalc");
var core_1 = require("@mantine/core");
var icons_1 = require("@tabler/icons");
var react_query_1 = require("@tanstack/react-query");
auto_1.Chart.register(auto_1.CategoryScale, auto_1.LinearScale, auto_1.PointElement, auto_1.Title, auto_1.Tooltip, auto_1.Legend, auto_1.Filler);
auto_1.Chart.defaults.font.size = 16;
var Performance = function () {
    var _a;
    var classes = useStyles().classes;
    var _b = react_1.useState(""), active = _b[0], setActive = _b[1];
    var _c = react_1.useState([]), userData = _c[0], setUserData = _c[1];
    var _d = react_1.useState([]), masteryData = _d[0], setMasteryData = _d[1];
    var _e = react_1.useState("All Students"), sort = _e[0], setSort = _e[1];
    var _f = react_1.useState(false), checkedHelp = _f[0], setCheckedHelp = _f[1];
    var _g = react_1.useState(false), notif = _g[0], setNotif = _g[1];
    var _h = react_query_1.useQueries({
        queries: [
            {
                queryKey: ["all-users"],
                queryFn: function () {
                    return axios_1["default"].get("/api/user/admin");
                }
            },
            {
                queryKey: ["all-topics"],
                queryFn: function () { return axios_1["default"].get("/api/topic"); }
            },
        ]
    }), users = _h[0].data, topics = _h[1].data;
    react_1.useEffect(function () {
        if (users) {
            setUserData(users.data.filter(function (user) {
                return user.id == active;
            }));
        }
    }, [users, active]);
    if (!users || !topics) {
        return (React.createElement(core_1.Center, { className: "h-screen" },
            React.createElement(core_1.Loader, null)));
    }
    var students = users.data;
    {
        sort === "Last Active (Newest)"
            ? students.sort(function (a, b) {
                return b.lastActive > a.lastActive ? 1 : -1;
            })
            : sort === "Last Active (Oldest)"
                ? students.sort(function (a, b) {
                    return a.lastActive > b.lastActive ? 1 : -1;
                })
                : students.sort(function (a, b) {
                    return a.username.localeCompare(b.username);
                });
    }
    var filteredStudents = [];
    var studentsWithTopicPing = students.filter(function (student) {
        return student.masteries.some(function (mastery) { return mastery.topicPing === true; });
    });
    var numStudentsWithTopicPing = studentsWithTopicPing.length;
    if (checkedHelp) {
        filteredStudents = studentsWithTopicPing;
    }
    else {
        filteredStudents = students;
    }
    var labelTopics = [];
    topics.data
        .sort(function (a, b) {
        return a.topicSlug.localeCompare(b.topicSlug);
    })
        .forEach(function (topic) {
        return labelTopics.push(topic.topicName);
    });
    var allData = [];
    for (var i = 0; i < labelTopics.length; ++i) {
        allData.push({
            label: labelTopics[i],
            data: masteryData[i]
        });
    }
    // Sort them by the data value
    allData.sort(function (a, b) { return b.data - a.data; });
    // And split them again
    var sortedLabels = allData.map(function (e) { return e.label; });
    var sortedData = allData.map(function (e) { return e.data; });
    // Look into componentMount if this still has multiple renders in production
    if (numStudentsWithTopicPing > 0 && !notif) {
        react_hot_toast_1["default"]("You have " + numStudentsWithTopicPing + " student" + (numStudentsWithTopicPing === 1 ? "" : "s") + " that require your help!", { duration: 3000, icon: React.createElement(icons_1.IconExclamationMark, null) });
        setNotif(true);
    }
    // TODO: Change .then to async/await
    var handleClick = function (data) {
        axios_1["default"]
            .post("/api/admin/updatePing", data)
            .then()["catch"](function (err) {
            console.log(err);
        });
    };
    var topicAvgMasteryLevels = [];
    topics.data.map(function (topic) {
        var totalMasteryLevel = 0;
        var count = 0;
        users.data.map(function (user) {
            var mastery = user.masteries.find(function (mastery) { return mastery.topicSlug === topic.topicSlug; });
            if (mastery && mastery.masteryLevel !== 0) {
                var masteryLevel = mastery.masteryLevel;
                totalMasteryLevel += masteryLevel;
                count++;
            }
        });
        if (count === 0) {
            topicAvgMasteryLevels.push({
                topic: topic.topicSlug,
                avgMasteryLevel: 0
            });
        }
        else {
            var avgMasteryLevel = totalMasteryLevel / count;
            topicAvgMasteryLevels.push({
                topic: topic.topicSlug,
                avgMasteryLevel: avgMasteryLevel
            });
        }
    });
    var counter = 0;
    (_a = userData[0]) === null || _a === void 0 ? void 0 : _a.masteries.map(function (mastery) {
        var topicAvgMastery = topicAvgMasteryLevels.find(function (t) {
            return t.topic === mastery.topicSlug;
        });
        if (topicAvgMastery && topicAvgMastery.avgMasteryLevel !== 0) {
            if (mastery.masteryLevel - topicAvgMastery.avgMasteryLevel > 0) {
                counter++;
            }
            else if (mastery.masteryLevel - topicAvgMastery.avgMasteryLevel < 0) {
                counter--;
            }
        }
    });
    return (React.createElement(core_1.ScrollArea, null,
        React.createElement(core_1.Container, { size: "lg" },
            React.createElement(core_1.Flex, { align: "center", justify: "space-between", pb: "md", gap: "md", wrap: "wrap" },
                React.createElement(core_1.Checkbox, { className: "self-end", label: "All students who need help!", checked: checkedHelp, onChange: function (event) { return setCheckedHelp(event.currentTarget.checked); } }),
                React.createElement(core_1.Select, { size: "sm", label: "Sort By", placeholder: "Pick one", data: [
                        { value: "All Students", label: "All Students" },
                        {
                            value: "Last Active (Newest)",
                            label: "Last Active (Newest)"
                        },
                        {
                            value: "Last Active (Oldest)",
                            label: "Last Active (Oldest)"
                        },
                    ], value: sort, onChange: setSort })),
            React.createElement(core_1.Accordion, { variant: "filled" }, filteredStudents.map(function (item) { return (React.createElement(core_1.Accordion.Item, { className: classes.item, value: item.username, key: item.id },
                React.createElement(core_1.Accordion.Control, { onClick: function () {
                        setActive(item.id);
                        setMasteryData(item.masteries
                            .sort(function (a, b) { return a.topicSlug.localeCompare(b.topicSlug); })
                            .map(function (mastery) { return mastery.masteryLevel; }));
                    } },
                    React.createElement(core_1.Group, { position: "apart" },
                        React.createElement(core_1.Group, { spacing: "sm" },
                            (item === null || item === void 0 ? void 0 : item.masteries.some(function (mastery) { return mastery.topicPing === true; })) ? (React.createElement(core_1.Indicator, { offset: 4, color: "red", withBorder: true },
                                React.createElement(core_1.Avatar, { size: "md", src: item.image, radius: 40 }))) : (React.createElement(core_1.Avatar, { size: "md", src: item.image, radius: 40 })),
                            React.createElement("div", null,
                                React.createElement(core_1.Text, { size: "sm", weight: 500 }, item.username),
                                React.createElement(core_1.Text, { size: "xs", color: "dimmed" }, item.email))),
                        DateDiffCalc_1.DateDiffCalc(item === null || item === void 0 ? void 0 : item.lastActive))),
                React.createElement(core_1.Accordion.Panel, null,
                    React.createElement(core_1.Center, null,
                        React.createElement(core_1.Group, { pb: "lg" },
                            React.createElement(core_1.Paper, { withBorder: true, radius: "md", p: "sm", h: 100 },
                                React.createElement(core_1.Group, null,
                                    React.createElement(core_1.RingProgress, { size: 80, roundCaps: true, thickness: 8, sections: [
                                            {
                                                value: (item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                                    item.attempts.length) *
                                                    100,
                                                color: (item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                                    item.attempts.length) *
                                                    100 >=
                                                    70
                                                    ? "green"
                                                    : (item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                                        item.attempts.length) *
                                                        100 <=
                                                        30
                                                        ? "red"
                                                        : "orange"
                                            },
                                        ], label: React.createElement(core_1.Center, null, (item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                            item.attempts.length) *
                                            100 >=
                                            70 ? (React.createElement(icons_1.IconChevronsUp, { size: 22, stroke: 1.5 })) : (item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                            item.attempts.length) *
                                            100 <=
                                            30 ? (React.createElement(icons_1.IconChevronsDown, { size: 22, stroke: 1.5 })) : (React.createElement(icons_1.IconChevronsRight, { size: 22, stroke: 1.5 }))) }),
                                    React.createElement("div", null,
                                        React.createElement(core_1.Text, { color: "dimmed", size: "xs", transform: "uppercase", weight: 700 }, "Overall correct %"),
                                        React.createElement(core_1.Text, { weight: 700, size: "xl" },
                                            item.attempts.length
                                                ? ((item.attempts.filter(function (attempt) { return attempt.isCorrect === true; }).length /
                                                    item.attempts.length) *
                                                    100).toFixed(2)
                                                : 0,
                                            "%")))),
                            React.createElement(core_1.Paper, { withBorder: true, radius: "md", p: "sm", h: 100 },
                                React.createElement(core_1.Group, { py: "md" },
                                    counter > 0 ? (React.createElement(icons_1.IconMoodSmile, { size: 40, color: "green" })) : counter < 0 ? (React.createElement(icons_1.IconMoodSad, { size: 40, color: "red" })) : (React.createElement(icons_1.IconMoodEmpty, { size: 40, color: "orange" })),
                                    React.createElement("div", null,
                                        React.createElement(core_1.Text, { color: "dimmed", size: "xs", transform: "uppercase", weight: 700 }, "Comparative Performance"),
                                        counter > 0 ? (React.createElement(core_1.Text, { weight: 700, size: "xl" }, "Above Average")) : counter < 0 ? (React.createElement(core_1.Text, { weight: 700, size: "xl" }, "Below Average")) : (React.createElement(core_1.Text, { weight: 700, size: "xl" }, "Average"))))))),
                    React.createElement(core_1.Box, null,
                        React.createElement(react_chartjs_2_1.Bar, { datasetIdKey: "id", data: {
                                labels: sortedLabels,
                                datasets: [
                                    {
                                        label: "Mastery Level",
                                        data: sortedData,
                                        backgroundColor: "rgba(0, 128, 128, 0.75)",
                                        borderColor: "rgba(0, 128, 128, 0.75)",
                                        borderWidth: 1,
                                        barPercentage: 0.8,
                                        categoryPercentage: 0.7
                                    },
                                ]
                            }, options: {
                                maintainAspectRatio: false,
                                indexAxis: "y",
                                scales: {
                                    y: {
                                        ticks: {
                                            autoSkip: false
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    x: {
                                        max: 1,
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function (value) {
                                                return value.toLocaleString(undefined, {
                                                    style: "percent"
                                                });
                                            }
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            } })),
                    React.createElement(core_1.Paper, { withBorder: true, radius: "md", p: "sm", mt: "md" },
                        React.createElement(core_1.Table, { sx: { minWidth: 800 }, verticalSpacing: "xs" },
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, "Topic"),
                                    React.createElement("th", null, "Difficulty"),
                                    React.createElement("th", null, "Need Help?"))),
                            React.createElement("tbody", null, topics.data.map(function (t) {
                                var _a, _b, _c;
                                return (React.createElement("tr", { key: t.topicSlug },
                                    React.createElement("td", null,
                                        React.createElement(core_1.Anchor, { size: "sm", onClick: function (event) { return event.preventDefault(); } }, t.topicName)),
                                    React.createElement("td", null, t.topicLevel),
                                    React.createElement("td", null,
                                        React.createElement(core_1.Checkbox, { defaultChecked: ((_a = userData[0]) === null || _a === void 0 ? void 0 : _a.masteries.some(function (m) { return m.topicSlug === t.topicSlug; })) && ((_c = (_b = userData[0]) === null || _b === void 0 ? void 0 : _b.masteries.find(function (m) { return m.topicSlug === t.topicSlug; })) === null || _c === void 0 ? void 0 : _c.topicPing), onChange: function () {
                                                var _a, _b, _c, _d;
                                                handleClick({
                                                    userId: (_a = userData[0]) === null || _a === void 0 ? void 0 : _a.id,
                                                    topicSlug: t.topicSlug,
                                                    newPing: !(((_b = userData[0]) === null || _b === void 0 ? void 0 : _b.masteries.some(function (m) { return m.topicSlug === t.topicSlug; })) && ((_d = (_c = userData[0]) === null || _c === void 0 ? void 0 : _c.masteries.find(function (m) { return m.topicSlug === t.topicSlug; })) === null || _d === void 0 ? void 0 : _d.topicPing))
                                                });
                                            } }))));
                            }))))))); })))));
};
exports["default"] = Performance;
var useStyles = core_1.createStyles(function (theme) { return ({
    item: {
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.lg,
        border: "1px solid " + (theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3])
    }
}); });
