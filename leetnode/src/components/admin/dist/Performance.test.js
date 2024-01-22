"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("@testing-library/react");
//import userEvent from "@testing-library/user-event";
var axios_1 = require("axios");
var react_query_1 = require("@tanstack/react-query");
var Performance_1 = require("./Performance");
// Mock the axios module
jest.mock("axios");
var mockUsersData = {
    data: [
        { id: "1", username: "user1 user1", lastActive: new Date(), masteries: [] },
        { id: "2", username: "user2 user2", lastActive: new Date(), masteries: [] },
    ]
};
var mockTopicsData = [
    { topicSlug: "topic1", topicName: "Topic 1", topicLevel: 1 },
    { topicSlug: "topic2", topicName: "Topic 2", topicLevel: 2 },
];
var queryClient = new react_query_1.QueryClient();
var Wrapper = function (_a) {
    var children = _a.children;
    return (React.createElement(react_query_1.QueryClientProvider, { client: queryClient }, children));
};
beforeEach(function () {
    jest.clearAllMocks();
});
describe("Performance component", function () {
    it('renders Performance component without crashing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            react_1.render(React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
                React.createElement(Performance_1["default"], null)));
            return [2 /*return*/];
        });
    }); });
    test('renders student performance data correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockUsers, mockTopics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockUsers = {
                        data: [
                            {
                                id: '1',
                                username: 'john_doe',
                                email: 'john@example.com',
                                lastActive: new Date('2022-01-01'),
                                image: 'john_avatar.jpg',
                                attempts: [],
                                masteries: []
                            },
                        ]
                    };
                    mockTopics = {
                        data: [
                            {
                                topicSlug: 'topic1',
                                topicName: 'Topic 1',
                                topicLevel: 1
                            },
                        ]
                    };
                    // Mock the axios.get function used by the component
                    jest.mock('axios');
                    axios_1["default"].get.mockImplementation(function (url) {
                        if (url === '/api/user/admin') {
                            return Promise.resolve({ data: mockUsers });
                        }
                        else if (url === '/api/topic') {
                            return Promise.resolve({ data: mockTopics });
                        }
                        throw new Error('Unexpected URL');
                    });
                    // Render the component
                    react_1.render(React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
                        React.createElement(Performance_1["default"], null)));
                    // Wait for data loading and rendering
                    return [4 /*yield*/, react_1.waitFor(function () {
                            // Example assertion: Check if a student's username is displayed
                            var usernameElement = react_1.screen.getByText('john_doe');
                            expect(usernameElement).toBeInTheDocument();
                            // Example assertion: Check if the overall correct percentage is displayed
                            var correctPercentageElement = react_1.screen.getByText(/Overall correct %/);
                            expect(correctPercentageElement).toBeInTheDocument();
                            // Add more assertions based on your component's structure and expected UI
                        })];
                case 1:
                    // Wait for data loading and rendering
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
function getAllUsers() {
    throw new Error("Function not implemented.");
}
// import React from 'react';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Performance from './Performance';
// import { DateDiffCalc } from '@/utils/DateDiffCalc';
// import userEvent from '@testing-library/user-event';
// const queryClient = new QueryClient();
// const mock = new MockAdapter(axios);
// describe('Performance Component', () => {
//   beforeEach(() => {
//     mock.reset();
//   });
//   it('renders Performance component without crashing', async () => {
//     const mockUsers = {
//       data: [
//         {
//           id: '1',
//           username: 'john_doe',
//           email: 'john.doe@example.com',
//           lastActive: '2022-01-12T12:00:00.000Z',
//           image: 'john_doe.jpg',
//           attempts: [],
//           masteries: [],
//         },
//       ],
//     };
//     const mockTopics = {
//       data: [
//         {
//           topicSlug: 'math',
//           topicName: 'Mathematics',
//           topicLevel: 'Intermediate',
//         },
//       ],
//     };
//     mock.onGet('/api/user/admin').reply(200, mockUsers);
//     mock.onGet('/api/topic').reply(200, mockTopics);
//     render(
//       <QueryClientProvider client={queryClient}>
//         <Performance />
//       </QueryClientProvider>
//     );
//   });
//   it('DateDiffCalc returns correct date difference', () => {
//     const currentDate = new Date();
//     const pastDate = new Date(currentDate);
//     pastDate.setDate(currentDate.getDate() - 5);
//     const result = DateDiffCalc(pastDate);
//     expect(result).toEqual('5 days ago');
//   });  
// });
