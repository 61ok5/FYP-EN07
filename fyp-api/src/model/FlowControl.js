const FlowControl = {}
const { query } = require('../db');

const db_notify_log = 'notification_log'
const db_notify_pri = 'notification_priority'
const db_notify_rules = 'notification_rules'



FlowControl.limitingNotification = async (checking) =>{

    const stmt = `Select log.rule_id, count(*) as count, rules.per_day, rules.priority from ${db_notify_log}  log, ${db_notify_rules}  rules where Date(log.created_at) = Date(NOW()) group by log.rule_id, log.tags`
    const result = await query(stmt)
    if(result.length === 0) return checking


    const blacklist = result.filter((log)=>{
        if(log.count >= log.per_day){
            return log            
        }else{
            console.log('Rule ' + log.rule_id + ' did not exceed the limit')
        }
    }).map((log)=>log.rule_id)

    //var currentRules = {}
    const highestPriority = ""

    checking.map((rule)=>{
        if(typeof highestPriority === undefined || rule.priority > highestPriority){
            highestPriority = rule.priority
        }
    })
    

    const final = checking.filter((rule)=>{
        if(!blacklist.includes(rule.rule_id) && rule.priority === highestPriority){
            console.log('Rule is not included in the blacklist')
            return rule
        }
    })

    return final

}

module.exports = FlowControl

