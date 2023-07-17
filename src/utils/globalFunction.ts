import { IMatchMap } from "../interfaces/interfaces"
import { dateHourNow, dateHourTomorrow } from "./date"

export function toCompare(item: IMatchMap) {

    if (`${`${item.match_matchDate.split(' ')[0]} ${item.match_matchDate.split(' ')[1]}`}` === `${`${dateHourTomorrow().split(' ')[0]} ${dateHourTomorrow().split(' ')[1]}`}`) {
      return false
    }
    else if (`${`${item.match_matchDate.split(' ')[0]} ${item.match_matchDate.split(' ')[1]}`}` === `${`${dateHourNow().split(' ')[0]} ${dateHourNow().split(' ')[1]}`}`) {
      if (parseInt(dateHourNow().split(' ')[2].split(':')[0]) >= parseInt(item.match_matchDate.split(' ')[2].split(':')[0]) - 1) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }

  }