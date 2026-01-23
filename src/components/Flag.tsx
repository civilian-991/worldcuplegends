// Flag component - uses CDN images for cross-platform compatibility
import { getFlagUrl } from '@/utils/flags';

interface FlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { width: 20, height: 15, cdn: 'w20' as const },
  md: { width: 28, height: 21, cdn: 'w40' as const },
  lg: { width: 40, height: 30, cdn: 'w40' as const },
  xl: { width: 56, height: 42, cdn: 'w80' as const },
};

export default function Flag({ countryCode, size = 'md', className = '' }: FlagProps) {
  const { width, height, cdn } = sizeMap[size];

  return (
    <img
      src={getFlagUrl(countryCode, cdn)}
      alt={`${countryCode} flag`}
      width={width}
      height={height}
      className={`inline-block rounded-sm object-cover ${className}`}
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
    />
  );
}
