// Documented corrections to corpus form assignments. The corpus occasionally
// registers a lemma under the wrong form (usually a present-stem lemma left
// untagged → "form 1" default). Each override moves an entry to its true form,
// optionally merging its counts into the canonical lemma already there.
// Keys: `root|form|lemma` as extracted from the corpus (pre-override).
export interface FormOverride { form: number; mergeInto?: string; why: string }

export const FORM_OVERRIDES: Record<string, FormOverride> = {
  'fry|1|yafotariy': {
    form: 8, mergeInto: '{fotaraY`',
    why: '60:12 yaftarīnahu is Form VIII iftarā (3FP surface); corpus left it untagged',
  },
  'swy|1|tusaw~aY`': {
    form: 2, mergeInto: 'saw~aY`',
    why: '4:42 tusawwā is Form II passive of sawwā; corpus left it untagged',
  },
  'gny|1|>agonaY`': {
    form: 4, mergeInto: '>agonato',
    why: 'mā aghnā ʿanhu idiom is Form IV aghnā (a few Form-I ghaniya tokens subsumed)',
  },
  'TwE|1|yuTaAEu': {
    form: 4, mergeInto: '>aTaAEa',
    why: '4:64 li-yuṭāʿa is the passive of Form IV aṭāʿa; corpus lemma quirk',
  },
  'Elw|1|taEa`laY`': {
    form: 6,
    why: 'taʿālā (Exalted is He) is Form VI tafāʿala morphology; corpus default form 1',
  },
  'Elw|4|taEaAla': {
    form: 6, mergeInto: 'taEa`laY`',
    why: 'taʿālaw (come!) is the imperative of Form VI taʿālā; corpus tags it (IV)',
  },
  'ndw|1|tanaAda': {
    form: 6,
    why: '68:21 fa-tanādaw is Form VI tanādā; corpus left it untagged',
  },
  'wSy|1|yuwSiy': {
    form: 4, mergeInto: '>awoSa`',
    why: '4:12 yūṣī is Form IV awṣā; corpus left the token untagged',
  },
  'mny|1|taman~aY`^': {
    form: 5, mergeInto: 'yataman~a',
    why: '22:52 tamannā is Form V; corpus left it untagged',
  },
};

export const MERGE_COUNT = Object.values(FORM_OVERRIDES).filter(o => o.mergeInto).length;
