import applyRules from "./applyRules";

import cacheControlFactory from "./engine/CacheControlEngineFactory";
import simpleFactory from "./engine/SimplifiedRuleEngineFactory";

export const CacheControlEngineFactory = cacheControlFactory;
export const SimplifiedRuleEngineFactory = simpleFactory;

export default applyRules;
