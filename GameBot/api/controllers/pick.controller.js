const PickStrategyFactory = require('../services/pickStrategyFactory.service');
const appInsights = require("applicationinsights");

const pick = async (req, res) => {
    var Player1Name = req.body.Player1Name;
    var matchId = req.body.MatchId;
    var turn = req.body.TurnNumber;
    if (Player1Name == undefined || matchId == undefined) {
        res.status(400);
        res.send("Player1NamerId or MatchId undefined");
        return;
    }
    
    const strategyOption = process.env.PICK_STRATEGY || "RANDOM";
    if (Player1Name == 'Libby' && turn = 0) {
        const result = FixedStrategy(RPSLSChoices[1]).pick();
    }
    if (Player1Name == 'Libby' && turn = 1) {
        const result = FixedStrategy(RPSLSChoices[2]).pick();
    }
    else {
        // implement arcade intelligence here
        const result = pickFromStrategy(strategyOption);
    }
    
    console.log('Against '+Player1Name+', strategy ' + strategyOption + '  played ' + result.text);
    
    const applicationInsightsIK = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    if (applicationInsightsIK) {
        if (appInsights && appInsights.defaultClient)
        {
            var client = appInsights.defaultClient;
            client.commonProperties = {
                strategy: strategyOption
            };
            client.trackEvent({name: "pick", properties: {matchId: matchId, strategy: strategyOption, move: result.text, player: Player1Name, bet: result.bet}});
        }
    }
    res.send({ "Move": result.text, "Bet": result.bet });
};

const pickFromStrategy = (strategyOption) => {
    const strategyFactory = new PickStrategyFactory();

    strategyFactory.setDefaultStrategy(strategyOption);
    const strategy = strategyFactory.getStrategy();
    return strategy.pick();
}

module.exports = {
    pick,
}
