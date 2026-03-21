addLayer("E", {
    name: "Eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        etr: n(0),
        best:n(0),
        total:n(0),
        resetTime: 0,
        bestTime:n(1e300),
        timeshard:n(1),
    }},
    color: "#b743de",
    requires(){a = n(2).pow(1024)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "Eternity Points", // Name of prestige currency
    baseResource: "Infinity Points", // Name of resource prestige is based on
    baseAmount() {return player.I.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {a=n(10).log(2).div(1024).toNumber()
        return a
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    directMult() {a = n(1)
            return a
    },
    canReset() {return player.I.points.gte(n(2).pow(1024))},//&&(player.I.points.lt(n(2).pow(1024)))
    update(diff){
        player.E.timeshard = player.E.timeshard.add(tmp.E.TSgen.times(diff))
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e",
        description: "E: Eternity",
        onPress(){if (canReset(this.layer)) doReset(this.layer)},
        unlocked(){return hasAchievement('A',135)}},
    ],
    layerShown(){return hasAchievement('A',135)},
    branches: ['I'],
    autoUpgrade() {return false},
    passiveGeneration()
    {
        mult = 0
        return mult
    },
    onPrestige(gain){
        if(player.E.etr.gte(1)&&n(player.E.resetTime).lt(player.E.bestTime)) player.E.bestTime = n(player.E.resetTime)
        player.E.etr = player.E.etr.add(tmp.E.etrgain)
    },
    tabFormat: {
    "Eternity Milestones": {
        content: [ "main-display","prestige-button","resource-display",
            ["display-text", () => tmp.E.EMtip],"milestones",
        ],
    },
    "Timeshard Generator": {
        content: [ "main-display","prestige-button","resource-display",
            ["display-text", () => tmp.E.TGtip],
            ["buyables",[1]]
    ],
    unlocked(){return hasMilestone('E',0)},
    },
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > 4) {
            player.E.timeshard=n(1)
       }
        if (layers[resettingLayer].row == 6) {
    let kept = []
    layerDataReset(this.layer, kept)
       }
    },
    milestones:{
        0: {
            requirementDescription() {a="1 Eternity"
                if(options.Chinese) a='永恒1次'
                return a
            },
            effectDescription() {a="Unlock Autobuyers for IP Doubler, which buy max IP Doubler without spending IP, and unlock Timeshard."
                if(options.Chinese) a="解锁IP倍增的自动购买器，其最大化购买IP倍增且不消耗无限点数，并解锁时间碎片"
                return a
            },
            done() { return player.E.etr.gte(1) },
            toggles:[["E", "IPDauto"]]
        },
    },
    buyables: {
        11: {
            title(){text = 'Timeshard Generator'
                if(options.Chinese) text='时间碎片生产器(TG)'
                text=text+'('+format(getBuyableAmount(this.layer, this.id))
                //if(tmp.T.freePP.neq(0))text=text+' + '+format(tmp.T.freePP)
                text=text+')'
                return text
            },
            cost(x) { a= new Decimal(3).pow(x).times(1)
                //if(hasUpgrade('T',41))a= new Decimal(1.1).pow(x).times(25)
                    return a
             },
            effect(x) {return x.times(tmp.E.TGmult)},
            display() {a= "Produce "+format(tmp.E.TGmult)+" Timeshards Per Second<br/>Effect:produces "+format(this.effect())
                if(buyableEffect('E',13).neq(1)) a=a+'^'+format(buyableEffect('E',13))+'='+format(tmp.E.TSgen)
                a=a+" timeshards/s<br/>"
            //if(tmp.T.ptGain.gte(tmp.T.softcapstart)) a=a+'After softcap: '+format(tmp.A.realPTgen)+' points/s<br/>'
            //if(tmp.T.ptmult.neq(1)) a=a+'Your other effects multiply your point gain by '+format(tmp.T.ptmult)+'.<br>'
            a=a+"Cost: "+format(this.cost())+' Eternity Points'
            if(options.Chinese) {a= "每秒生产"+format(tmp.E.TGmult)+"时间碎片<br/>总效果:每秒生产"+format(this.effect())
                if(buyableEffect('E',13).neq(1)) a=a+'^'+format(buyableEffect('E',13))+'='+format(tmp.E.TSgen)
                a=a+"时间碎片<br/>"
            //if(tmp.T.ptGain.gte(tmp.T.softcapstart)) a=a+'软上限后:'+format(tmp.A.realPTgen)+'点数/s<br/>'
            //if(tmp.T.ptmult.neq(1)) a=a+'其他效果也使点数获取x'+format(tmp.T.ptmult)+'.<br>'
            a=a+"花费:"+format(this.cost())+'永恒点数'}
            return a },
            unlocked() {return hasMilestone('E', 0)},
            canAfford() { return player.E.points.gte(this.cost()) },
            purchaseLimit() {a = n(1.79e309)
                //if (gcs('E', 71)==1) a = n(1.79e309)
                    return a
            },
            buy() {
                player.E.points = player.E.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
					if (!this.canAfford()) return;
					let tempBuy = player.E.points.max(1).div(1).log(3).sub(1)
					//if (tempBuy.gte(25)) tempBuy = tempBuy.times(625).cbrt();
					let target = tempBuy.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
			},
        },
        12: {
            title(){text = 'Timeshard Multiplier'
                if(options.Chinese) text='时间碎片加成器(TM)'
                text=text+'('+format(getBuyableAmount(this.layer, this.id))
                //if(tmp.T.freePPM.neq(0))text=text+' + '+format(tmp.T.freePPM)
                text=text+')'
                return text
            },
            cost(x) { a= new Decimal(10).pow(x).times(1000)
                return a
             },
            effect(x) {a= tmp.E.TMbase.pow(x)
                return a
            },
            display() { a= "Multiply Timeshard Generator base effect by "+format(tmp.E.TMbase)+"<br/>Effect:"+format(this.effect())
                a=a+"x<br/>Cost: "+format(this.cost())+' Eternity Points'
                if(options.Chinese){a= "时间碎片生成器效果x"+format(tmp.T.PPMbase)+"<br/>效果:"+format(this.effect())
                a=a+"x<br/>花费:"+format(this.cost())+'永恒点数'}
            return a },
            unlocked() {return hasMilestone('E', 0)},
            canAfford() { return player.E.points.gte(this.cost()) },
            purchaseLimit() {a = n(1.79e309)
                //if (gcs('E', 71)==1) a = n(1.79e309)
                    return a
            },
            buy() {
                player.E.points = player.E.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
					if (!this.canAfford()) return;
					let tempBuy = player.E.points.max(1000).div(1000).log(10).sub(1)
					let target = tempBuy.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
			},
        },
        13: {//incompleted
            title(){text = 'Timeshare Exponent Factory'
                if(options.Chinese) text='时间碎片指数因子(TEF)'
                text=text+'('+format(getBuyableAmount(this.layer, this.id))
                //if(tmp.T.freePEF.neq(0))text=text+' + '+format(tmp.T.freePEF)
                text=text+')'
                return text
            },
            cost(x) { return new Decimal(1e100).pow(x.pow(2)).times('1e1500') },
            effect(x) {a=x.times(tmp.T.PEFbase).add(1)
                if(inChallenge('I',14)) a=player.ST.total.add(1).pow(0.6).times(player.MT.total.add(1)).log(10).times(0.01).add(1).min(1.5)
                if(inChallenge('ST',13)) a=n(1)
                if(inChallenge('MT',14)) a=n(1)
                if(inChallenge('I',21)) a=a.min(1.2)
                if(inChallenge('T',11)) a=a.times(0.75)
                if(inChallenge('ST',11)) a=a.times(0.5)
                if(a.gte(1.5)) a=a.sub(1.5).div(10).add(1.5)
                if(a.gte(2)) a=a.add(2).log(2)
                if(a.gte(3)) a=a.div(3).pow(0.5).times(3)
                a=a.times(tmp.T.PEFmult)
                    return a
            },
            display() { a="Add "+format(tmp.T.PEFbase,4)+" to Point Producer Effect Exponent<br/>Effect:^"+format(this.effect().div(tmp.T.PEFmult),4)
                if(buyableEffect('T',13).gte(n(1.5).times(tmp.T.PEFmult))) a=a+'(Softcapped)'
                if(tmp.T.PEFmult.neq(1)) a=a+'x'+format(tmp.T.PEFmult)+'='+format(this.effect(),4)
                a=a+"<br/>Cost: "+format(this.cost())+' points'
            if(options.Chinese) {a="点数生产器总效果指数+"+format(tmp.T.PEFbase,4)+"<br/>效果:^"+format(this.effect().div(tmp.T.PEFmult),4)
                if(buyableEffect('T',13).gte(n(1.5).times(tmp.T.PEFmult))) a=a+'(受软上限限制)'
                if(tmp.T.PEFmult.neq(1)) a=a+'x'+format(tmp.T.PEFmult)+'='+format(this.effect(),4)
                a=a+"<br/>花费:"+format(this.cost())+'点数'}
            return a },
            unlocked() {return false},
            canAfford() { return player.E.points.gte(this.cost()) },
            purchaseLimit() {a = n(1.79e309)
                //if (gcs('E', 71)==1) a = n(1.79e309)
                    return a
            },
            buy() {
                player.E.points = player.E.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
					if (!this.canAfford()) return;
					let tempBuy = player.E.points.max(2e5).div(2e5).log(20).pow(0.5)
					//if (tempBuy.gte(25)) tempBuy = tempBuy.times(625).cbrt();
					let target = tempBuy.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
			},
        },
    },
    etrgain(){a=n(1)
        return a
    },
    EMtip(){a='You have gone Eternity '+format(player.E.etr)+' times.<br/>'
        a=a+'You have spent '+formatTime(player.E.resetTime)+' in this Eternity.<br/>'
        a=a+'Your best Eternity time is '+formatTime(player.E.bestTime)+'.(The first Eternity is not counted in)<br/>'
        a=a+'You will gain '+format(tmp.E.etrgain)+' Eternity(ies) on reset.<br>'
        if(options.Chinese){a='你已经永恒了'+format(player.E.etr)+'次<br/>'
        a=a+'你在本次永恒中花费了'+formatTime(player.E.resetTime)+'<br/>'
        a=a+'你最快的永恒时间为'+formatTime(player.E.bestTime)+'(第一次永恒不计入)<br/>'
        a=a+'在永恒后，你将获得'+format(tmp.E.etrgain)+'次永恒次数<br>'}
        return a
    },
    TGtip(){a="You have <h3 style='color: #b743de; text-shadow: 0 0 3px #c2b280'>" + format(player.E.timeshard) + "</h3> Timeshards, which boost all pre-Eternity resource generation and effective time in the Time-based boosts by " +format(tmp.E.TSeffect)+'.'
        a=a+'<br>Your Eternity amount give your Timeshard Generator a multiplier of x'+format(player.E.etr.times(0.01).min(1))+'.'
        if(options.Chinese){a="你有 <h3 style='color: #b743de; text-shadow: 0 0 3px #c2b280'>" + format(player.E.timeshard) + "</h3> 时间碎片, 使所有永恒前资源生成与基于时间加成中的有效时间x" +format(tmp.E.TSeffect)+'.'
            a=a+'<br>你的永恒次数使你的时间碎片生成器效果x'+format(player.E.etr.times(0.01).min(1))
        }
        a=a+'<br>('+format(tmp.E.TSgen)+'/sec)'
        return a
    },
    TSeffect(){a=n(1)
        a=n(10).pow(player.E.timeshard.log(10).pow(0.5)).min(player.E.timeshard)
        return a
    },
    TSgen(){a=buyableEffect('E',11)
        return a
    },
    TGmult(){a=player.E.etr.times(0.01).min(1)
        return a
    },
    TMbase(){a=n(2)
        return a
    }
})