import { Ability, AbilityBuilder } from "@casl/ability";
import { store } from "../redux/storeConfig/store";

const ability = new Ability();

export default (action, subject) => {
  return ability.can(action, subject);
};

store.subscribe(() => {
  let auth = store.getState().auth;
  ability.update(defineRulesFor(auth));
});

const defineRulesFor = (auth) => {
  const permissions = auth.permissions;
  const { can, rules } = new AbilityBuilder();
  // This logic depends on how the
  // server sends you the permissions array

  if (permissions) {
    permissions.forEach((p) => {
      let per = p.split("_");
      can(per[0], per[1]);
    });
  }

  return rules;
};
