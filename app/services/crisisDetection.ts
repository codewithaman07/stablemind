const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'don\'t want to live', 'want to die',
  'worthless', 'hopeless', 'no reason to live', 'better off dead', 'ending it all',
  'taking my life', 'harm myself', 'hurt myself', 'self-harm', 'death wish',
];

export function detectCrisis(message: string): boolean {
  const lowercaseMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowercaseMessage.includes(keyword));
}

// Mental health helplines in HTML format
export const mentalHealthHelplines = `
<div class="helpline-container">
  <b>Mental Health Helplines - Please Reach Out:</b>
  <br/><br/>• <b>International Association for Suicide Prevention:</b> <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank">Find a Crisis Center</a>
  <br/>• <b>Crisis Text Line:</b> Text HOME to 741741 (US & Canada)
  <br/>• <b>National Suicide Prevention Lifeline (US):</b> 1-800-273-8255
  <br/>• <b>Befrienders Worldwide:</b> <a href="https://www.befrienders.org/" target="_blank">Find a Helpline</a>
  <br/><br/><b>You are not alone. Help is available. Your life matters.</b>
</div>
`;


