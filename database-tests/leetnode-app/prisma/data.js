const {Prisma} = require('@prisma/client')

const Topic = [
    {
      topicId: "cl8qulhvq0000umngxchfdyb1",
      topicName: 'Power = V x I',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundks000eumngieuqvazh",
      topicName: "Ohm's Law",
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr000cumng2jffd8dz",
      topicName: 'KVL',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr000aumngjm7023sg",
      topicName: 'KCL',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr0008umngtxi7uwz4",
      topicName: 'Thevenin Equivalent Circuit',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr0006umngbyhbkmb7",
      topicName: 'Equivalent Resistance when connected in Series or Parallel',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr0004umngxo6sxb3f",
      topicName: 'Voltage Division Principle',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8qundkr0002umngeusl83n2",
      topicName: 'Current Division Principle',
      topicLevel: "Foundational",
    },
    {
      topicId: "cl8quq990000gumng81t4ghlr",
      topicName: 'Node Voltage Analysis Technique',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq990000iumng0zzknf44",
      topicName: 'Steady State Analysis of RLC Circuits',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq991000kumngyl66xff2",
      topicName: 'Transient Analysis of Series RC Circuits and Series RL Circuits',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq991000mumnglzcbyb1v",
      topicName: 'Equivalent Capacitance When Connected in Series or Parallel',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq991000oumngoa07oo4a",
      topicName: 'Equivalent Inductance When Connected in Series or Parallel',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq991010limoiqwzbst1z",
      topicName: "Energy Stored in Capacitors, Inductors",
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq992000sumngitlxflqz",
      topicName: 'Electrical Circuit Model of PMDC Motors',
      topicLevel: "Intermediate",
    },
    {
      topicId: "cl8quq992000uumnghkg6gywm",
      topicName: 'Torque Equation',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq992000wumngqzwwi4q3",
      topicName: 'Calculation of Mechanical Power & Electrical Power of DC Motors',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq992000yumng49kawccu",
      topicName: 'Gains of Inverting and Non-Inverting Amplifiers',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq9930010umngj1a0v6j9",
      topicName: 'Op-Amp Golden Rules',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq9930012umng024o4d5s",
      topicName: 'Analysis of Circuits Containing Op-Amps',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq9930014umng4692eh7s",
      topicName: 'First Order Low Pass Filters',
      topicLevel: "Advanced",
    },
    {
      topicId: "cl8quq9930016umngt08y92lx",
      topicName: 'First Order High Pass Filters',
      topicLevel: "Advanced",
    },
  ];
  
  const Question = [
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      topicId: "cl8qundks000eumngieuqvazh",
      questionContent: 'For the circuit shown in the figure above, what is the value of current I1?',
      questionDifficulty: "Easy",
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      topicId: "cl8qundkr0004umngxo6sxb3f",
      questionContent: 'For the circuit shown in the figure above, what is the voltage V1?',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      topicId: "cl8qundkr0006umngbyhbkmb7",
      questionContent: 'A current of 3 A flows through a resistor network as shown in the figure above. The voltage difference VXY (given by VX - VY) is',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      topicId: "cl8qundkr0008umngtxi7uwz4",
      questionContent: 'What is the value of R that will result in a current of I = 0.25 A passing through R? (Hint: Use Thevenin equivalent circuit)',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      topicId: "cl8qundkr0004umngxo6sxb3f",
      questionContent: 'What is the maximum power that can be utilized by the variable load R?',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      topicId: "cl8qundkr0008umngtxi7uwz4",
      questionContent: 'For the circuit shown in the figure above, what is the Thevenin equivalent circuit as seen by the load RL?',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      topicId: "cl8quq990000gumng81t4ghlr",
      questionContent: 'For the circuit shown in the figure above, what is the node voltage VA?',
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      topicId: "cl8qundkr0004umngxo6sxb3f",
      questionContent: "For the circuit shown in the figure above, is Battery B being recharged or discharged? What is the power lost in Battery B's internal resistance?",
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      topicId: "cl8quq991000kumngyl66xff2",
      questionContent: 'In the circuit shown in the figure above, the two switches were opened for a very long time before time t = 0. At time t = 0, both the switches are closed simultaneously. How long does it take for the voltage VL(t) to fall to 7 V after the switches are closed?',
      questionDifficulty: "Hard",
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      topicId: "cl8quq991000kumngyl66xff2",
      questionContent: "In the circuit shown in the figure above, the capacitor was fully discharged initially. At time t = 0, the switch is closed. If it takes 6 s for the practical capacitor's voltage VPC(t) to rise to 6 V, what is the value of capacitance C?",
      questionDifficulty: "Hard",
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      topicId: "cl8quq990000iumng0zzknf44",
      questionContent: "In the circuit shown in the figure above, the capacitor's voltage vC(t) is",
      questionDifficulty: "Medium",
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      topicId: "cl8quq990000iumng0zzknf44",
      questionContent: 'In the circuit shown in the figure above, a 100-ohm resistor is connected in series with a practical inductor. The practical inductor has a resistance of 10-ohm, and an unknown inductance L. Suppose the phase angle of the voltage vR(t) is found to be –35° with respect to the source voltage vS(t), what is the voltage across the practical inductor vPL(t)?',
      questionDifficulty: "Hard",
    },
  ];

  const Answer = [
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      optionNumber: 1,
      answerContent: "0.2A",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      optionNumber: 2,
      answerContent: "1A",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      optionNumber: 3,
      answerContent: "0.6A",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      optionNumber: 4,
      answerContent: "0.8A",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      optionNumber: 1,
      answerContent: "2mV",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      optionNumber: 2,
      answerContent: "2.5V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      optionNumber: 3,
      answerContent: "10V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      optionNumber: 4,
      answerContent: "0.2V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      optionNumber: 1,
      answerContent: "0.67V",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      optionNumber: 2,
      answerContent: "1V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      optionNumber: 3,
      answerContent: "-0.67V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      optionNumber: 4,
      answerContent: "-1V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      optionNumber: 1,
      answerContent: "\(4~\Omega\)",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      optionNumber: 2,
      answerContent: "\(11~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      optionNumber: 3,
      answerContent: "\(10.2~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      optionNumber: 4,
      answerContent: "\(20.8~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      optionNumber: 1,
      answerContent: "113mW",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      optionNumber: 2,
      answerContent: "173mW",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      optionNumber: 3,
      answerContent: "163mW",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      optionNumber: 4,
      answerContent: "703mW",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      optionNumber: 1,
      answerContent: "\(V_T = 7~V,~~~~~R_T = 1.2~\Omega\)",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      optionNumber: 2,
      answerContent: "\(V_T = 7~V,~~~~~R_T = 1.33~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      optionNumber: 3,
      answerContent: "\(V_T = 7.4~V,~~~~~R_T = 1.2~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      optionNumber: 4,
      answerContent: "\(V_T = 7.4~V,~~~~~R_T = 1.33~\Omega\)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      optionNumber: 1,
      answerContent: "3.83V",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      optionNumber: 2,
      answerContent: "4V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      optionNumber: 3,
      answerContent: "4.13V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      optionNumber: 4,
      answerContent: "4.24V",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      optionNumber: 1,
      answerContent: "Battery B is being recharged;  Power lost in Battery B's internal resistance is 0.365mW.",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      optionNumber: 2,
      answerContent: "Battery B is being recharged;  Power lost in Battery B's internal resistance is 36.5mW.",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      optionNumber: 3,
      answerContent: "Battery B is being discharged;  Power lost in Battery B's internal resistance is 0.365mW.",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      optionNumber: 4,
      answerContent: "Battery B is being discharged;  Power lost in Battery B's internal resistance is 36.5mW.",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      optionNumber: 1,
      answerContent: "83.8ms",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      optionNumber: 2,
      answerContent: "377ms",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      optionNumber: 3,
      answerContent: "18.6ms",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      optionNumber: 4,
      answerContent: "44.5ms",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      optionNumber: 1,
      answerContent: "0.74F",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      optionNumber: 2,
      answerContent: "0.863F",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      optionNumber: 3,
      answerContent: "0.987F",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      optionNumber: 4,
      answerContent: "1.11F",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      optionNumber: 1,
      answerContent: "56.9 cos (100t - 129.3°)",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      optionNumber: 2,
      answerContent: "80.4 cos (100t - 84.3°)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      optionNumber: 3,
      answerContent: "1.13 cos (100t + 129.3°)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      optionNumber: 4,
      answerContent: "56.9 cos (100t - 39.3°)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      optionNumber: 1,
      answerContent: "2.89 cos (100t + 47.6°)",
      isCorrect: true,
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      optionNumber: 2,
      answerContent: "3.34 cos (100t + 55°)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      optionNumber: 3,
      answerContent: "3.55 cos (100t + 39.8°)",
      isCorrect: false,
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      optionNumber: 4,
      answerContent: "4.1 cos (100t + 31.4°)",
      isCorrect: false,
    },
  ];

  const QuestionMedia =[
    {
      questionId: "cl8qv59e50018umngkz0d4wi7",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075351/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q01-1_bzugpn.png",
    },
    {
      questionId: "cl8qv59e50019umng5ifrf3ad",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075351/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q02-1_ujltou.png",
    },
    {
      questionId: "cl8qv59e5001aumngrtppz23v",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075351/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q03-1_ah6aen.png",
    },
    {
      questionId: "cl8qv59e5001bumngswwjm2lh",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q04_gxwt6z.png",
    },
    {
      questionId: "cl8qv59e6001cumng36oz1yz6",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075184/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q05-1_dbyrie.png",
    },
    {
      questionId: "cl8qv59e6001dumngql96fas5",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075184/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q06-1_inu8j6.png",
    },
    {
      questionId: "cl8qv59e6001fumngv41yuwrv",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075184/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q07-1_l9qdr1.png",
    },
    {
      questionId: "cl8qv59e6001humng3viz0m37",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q08-1_aq5z1i.png",
    },
    {
      questionId: "cl8qv59e6001iumngef0r5ooa",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q09_bxprfz.png",
    },
    {
      questionId: "cl8qv59e7001jumng9i68vwi9",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q10_uvao4q.png",
    },
    {
      questionId: "cl8qv59e7001lumngiyu3yfvb",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q11-1_yh1hrm.png",
    },
    {
      questionId: "cl8qv59e7001numngt93gzr1f",
      questionMediaURL: "https://res.cloudinary.com/dy2tqc45y/image/upload/v1664075350/LeetNode/CG1111_2122_Q1/AY2122-Quiz1-Q12_qiopxh.png",
    },
  ];
  
  module.exports = {
    Topic,
    Question,
    Answer,
    QuestionMedia
  };