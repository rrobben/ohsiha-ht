module FormHelper

	def labeled_form_for(record, options = {}, &block)
	puts record
	puts options
	puts block.parameters
			options.merge! builder: BuilderHelper
			form = form_for record, options, &block
			puts form
			form
	end

	class BuilderHelper < ActionView::Helpers::FormBuilder
		
		def text_field(attribute, options={})
			label(attribute) + super
		end

	end

end
