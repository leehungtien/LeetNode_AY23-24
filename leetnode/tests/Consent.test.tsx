import React from 'react';
import { render } from '@testing-library/react';
import Consent from '../src/components/forms/Consent';

describe('Consent Component', () => {
    it('should render protocol title', () => {
      const { getByText } = render(<Consent />);
      const protocolTitleElement = getByText('Protocol title');
      expect(protocolTitleElement).toBeInTheDocument();
    });
  
    it('should render principal investigator', () => {
      const { getByText } = render(<Consent />);
      const principalInvestigatorElement = getByText('Principal Investigator and Co-Investigator(s)');
      expect(principalInvestigatorElement).toBeInTheDocument();
    });
  });

