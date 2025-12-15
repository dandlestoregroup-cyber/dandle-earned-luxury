import { formatEGP } from "@/data/productDetails";

interface MechanismSelectorProps {
  basePrice: number;
  powerUpgrade: number;
  selectedMechanism: 'manual' | 'power';
  onMechanismChange: (mechanism: 'manual' | 'power') => void;
  isLiftChair?: boolean;
}

export const MechanismSelector = ({ 
  basePrice, 
  powerUpgrade, 
  selectedMechanism, 
  onMechanismChange,
  isLiftChair = false
}: MechanismSelectorProps) => {
  // Lift chairs only have power option
  if (isLiftChair || powerUpgrade === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="font-body text-sm font-medium text-foreground">
        Mechanism Type
      </label>
      <div className="space-y-2">
        <label 
          className={`
            flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer
            transition-all duration-200
            ${selectedMechanism === 'manual' 
              ? 'border-bronze bg-bronze/5' 
              : 'border-border hover:border-muted-foreground/50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="mechanism"
              value="manual"
              checked={selectedMechanism === 'manual'}
              onChange={() => onMechanismChange('manual')}
              className="w-4 h-4 text-bronze focus:ring-bronze"
            />
            <div>
              <span className="font-medium text-foreground">Manual Recline</span>
              <p className="text-sm text-muted-foreground">Classic lever-operated mechanism</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Included</span>
        </label>
        
        <label 
          className={`
            flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer
            transition-all duration-200
            ${selectedMechanism === 'power' 
              ? 'border-bronze bg-bronze/5' 
              : 'border-border hover:border-muted-foreground/50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="mechanism"
              value="power"
              checked={selectedMechanism === 'power'}
              onChange={() => onMechanismChange('power')}
              className="w-4 h-4 text-bronze focus:ring-bronze"
            />
            <div>
              <span className="font-medium text-foreground">Power Recline</span>
              <p className="text-sm text-muted-foreground">Electric motor with remote control</p>
            </div>
          </div>
          <span className="text-sm font-medium text-bronze">+{formatEGP(powerUpgrade)}</span>
        </label>
      </div>
    </div>
  );
};
